<?php
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

// 1. Create Order (Checkout)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'create') {
    $input = json_decode(file_get_contents('php://input'), true);

    $packageId = trim($input['packageId'] ?? 'pro');
    $packageName = trim($input['packageName'] ?? 'Professional Plan');
    $amountEgp = floatval($input['amountEgp'] ?? 49);
    $senderPhone = trim($input['senderPhone'] ?? '');
    $transactionId = strtoupper(trim($input['transactionId'] ?? ''));
    $customerEmail = strtolower(trim($input['customerEmail'] ?? ''));
    $customerName = trim($input['customerName'] ?? 'عميل محترم');

    if (empty($senderPhone) || empty($transactionId) || empty($customerEmail)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit();
    }

    // Check duplicate transaction ID
    $stmt = $pdo->prepare("SELECT id FROM orders WHERE UPPER(transaction_id) = ? LIMIT 1");
    $stmt->execute([$transactionId]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "رقم العملية (Transaction ID) مستخدم بالفعل في طلب سابق. لا يمكن تكراره."
        ]);
        exit();
    }

    // Generate unique order number
    $orderNumber = 'CVM-' . rand(10000, 99999);

    $insert = $pdo->prepare("
        INSERT INTO orders (order_number, package_id, package_name, amount_egp, sender_phone, transaction_id, customer_email, customer_name, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'طلب جديد بانتظار مراجعة الإدارة')
    ");

    $insert->execute([
        $orderNumber,
        $packageId,
        $packageName,
        $amountEgp,
        $senderPhone,
        $transactionId,
        $customerEmail,
        $customerName
    ]);

    echo json_encode([
        "success" => true,
        "message" => "تم تسجيل طلبك بنجاح وهو قيد المراجعة.",
        "order" => [
            "orderNumber" => $orderNumber,
            "packageId" => $packageId,
            "amountEgp" => $amountEgp,
            "transactionId" => $transactionId,
            "status" => "pending"
        ]
    ]);
    exit();
}

// 2. Track Order
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'track') {
    $q = trim($_GET['q'] ?? '');
    if (empty($q)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Query required."]);
        exit();
    }

    $stmt = $pdo->prepare("
        SELECT * FROM orders 
        WHERE order_number = ? OR customer_email = ? OR transaction_id = ? OR sender_phone = ?
        ORDER BY id DESC LIMIT 10
    ");
    $stmt->execute([$q, $q, $q, $q]);
    $orders = $stmt->fetchAll();

    if (empty($orders)) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "لم يتم العثور على أي طلب يطابق هذا البحث"]);
        exit();
    }

    echo json_encode(["success" => true, "orders" => $orders]);
    exit();
}

// 3. Get Public Settings
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'settings') {
    $stmt = $pdo->query("SELECT vodafone_cash_wallet, pro_price_egp, premium_price_egp, payment_instructions_ar, payment_instructions_en FROM settings LIMIT 1");
    $settings = $stmt->fetch();
    echo json_encode(["success" => true, "settings" => $settings]);
    exit();
}
