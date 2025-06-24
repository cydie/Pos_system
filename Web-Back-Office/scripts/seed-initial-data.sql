-- Seed initial data for the POS system

-- Insert default branches
INSERT OR IGNORE INTO branches (id, name, address, phone, taxRate, createdAt, updatedAt) VALUES
(1, 'Main Store', '123 Main Street, City, State 12345', '+1-555-0123', 0.10, datetime('now'), datetime('now')),
(2, 'Downtown Branch', '456 Downtown Ave, City, State 12345', '+1-555-0124', 0.08, datetime('now'), datetime('now')),
(3, 'Mall Location', '789 Shopping Mall, City, State 12345', '+1-555-0125', 0.10, datetime('now'), datetime('now'));

-- Insert default admin user
INSERT OR IGNORE INTO users (id, name, pin, role, branchId, createdAt, updatedAt) VALUES
(1, 'System Admin', '123456', 'admin', 1, datetime('now'), datetime('now')),
(2, 'Store Manager', '234567', 'manager', 1, datetime('now'), datetime('now')),
(3, 'Cashier One', '345678', 'cashier', 1, datetime('now'), datetime('now')),
(4, 'Cashier Two', '456789', 'cashier', 2, datetime('now'), datetime('now'));

-- Insert sample product categories and products
INSERT OR IGNORE INTO products (id, name, sku, barcode, price, cost, category, stock, lowStockWarning, createdAt, updatedAt) VALUES
-- Food items
(1, 'Coca Cola 330ml', 'COKE-330', '1234567890123', 2.50, 1.20, 'Drinks', 100, 20, datetime('now'), datetime('now')),
(2, 'Pepsi 330ml', 'PEPSI-330', '1234567890124', 2.50, 1.20, 'Drinks', 80, 20, datetime('now'), datetime('now')),
(3, 'Water Bottle 500ml', 'WATER-500', '1234567890125', 1.50, 0.60, 'Drinks', 150, 30, datetime('now'), datetime('now')),
(4, 'Sandwich - Ham & Cheese', 'SAND-HAM', '1234567890126', 6.99, 3.50, 'Food', 25, 5, datetime('now'), datetime('now')),
(5, 'Chocolate Bar', 'CHOC-BAR', '1234567890127', 3.99, 2.00, 'Food', 60, 15, datetime('now'), datetime('now')),
-- Electronics
(6, 'Phone Charger USB-C', 'CHAR-USBC', '1234567890128', 19.99, 8.00, 'Electronics', 40, 10, datetime('now'), datetime('now')),
(7, 'Bluetooth Earbuds', 'BT-EARBUDS', '1234567890129', 49.99, 25.00, 'Electronics', 20, 5, datetime('now'), datetime('now')),
-- Clothing
(8, 'T-Shirt Basic White M', 'TSHIRT-WM', '1234567890130', 15.99, 7.00, 'Clothing', 30, 8, datetime('now'), datetime('now')),
(9, 'Jeans Blue 32W', 'JEANS-B32', '1234567890131', 39.99, 20.00, 'Clothing', 15, 5, datetime('now'), datetime('now')),
-- Books
(10, 'Notebook A4 Lined', 'NOTE-A4L', '1234567890132', 4.99, 2.50, 'Books', 50, 12, datetime('now'), datetime('now'));

-- Insert inventory for each branch
INSERT OR IGNORE INTO inventory (productId, branchId, quantity) VALUES
-- Main Store (Branch 1)
(1, 1, 100), (2, 1, 80), (3, 1, 150), (4, 1, 25), (5, 1, 60),
(6, 1, 40), (7, 1, 20), (8, 1, 30), (9, 1, 15), (10, 1, 50),
-- Downtown Branch (Branch 2)
(1, 2, 75), (2, 2, 60), (3, 2, 100), (4, 2, 20), (5, 2, 45),
(6, 2, 25), (7, 2, 15), (8, 2, 20), (9, 2, 10), (10, 2, 35),
-- Mall Location (Branch 3)
(1, 3, 120), (2, 3, 90), (3, 3, 200), (4, 3, 30), (5, 3, 80),
(6, 3, 50), (7, 3, 25), (8, 3, 40), (9, 3, 20), (10, 3, 60);

-- Insert sample customers
INSERT OR IGNORE INTO customers (id, name, email, phone, loyaltyPoints, createdAt, updatedAt) VALUES
(1, 'John Smith', 'john.smith@email.com', '+1-555-1001', 150, datetime('now'), datetime('now')),
(2, 'Sarah Johnson', 'sarah.j@email.com', '+1-555-1002', 75, datetime('now'), datetime('now')),
(3, 'Mike Wilson', 'mike.wilson@email.com', '+1-555-1003', 200, datetime('now'), datetime('now')),
(4, 'Emily Davis', 'emily.davis@email.com', '+1-555-1004', 50, datetime('now'), datetime('now'));

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value, description, updatedAt) VALUES
('store_name', 'My POS Store', 'Store name for receipts', datetime('now')),
('store_address', '123 Main Street\nCity, State 12345', 'Store address for receipts', datetime('now')),
('store_phone', '+1-555-0123', 'Store phone number', datetime('now')),
('default_tax_rate', '0.10', 'Default tax rate (10%)', datetime('now')),
('tax_inclusive', 'false', 'Whether prices include tax', datetime('now')),
('receipt_header', 'Thank you for shopping with us!', 'Receipt header message', datetime('now')),
('receipt_footer', 'Visit us again soon!', 'Receipt footer message', datetime('now')),
('low_stock_enabled', 'true', 'Enable low stock warnings', datetime('now')),
('currency_symbol', '$', 'Currency symbol', datetime('now')),
('loyalty_points_rate', '0.01', 'Points earned per dollar spent', datetime('now'));

-- Insert default tax rates
INSERT OR IGNORE INTO tax_rates (id, name, rate, isDefault, isActive, description) VALUES
(1, 'Standard Tax', 0.10, true, true, 'Standard 10% tax rate'),
(2, 'Reduced Tax', 0.05, false, true, 'Reduced 5% tax rate for essentials'),
(3, 'Zero Tax', 0.00, false, true, 'Tax-free items');

-- Insert default payment methods
INSERT OR IGNORE INTO payment_methods (id, name, isActive, requiresCash, description) VALUES
(1, 'Cash', true, true, 'Cash payment'),
(2, 'Credit Card', true, false, 'Credit card payment'),
(3, 'Debit Card', true, false, 'Debit card payment'),
(4, 'Mobile Payment', true, false, 'Mobile payment (Apple Pay, Google Pay)'),
(5, 'Gift Card', true, false, 'Store gift card');

-- Insert sample expense categories
INSERT OR IGNORE INTO expenses (id, branchId, category, description, amount, date, createdAt, updatedAt) VALUES
(1, 1, 'Utilities', 'Monthly electricity bill', 250.00, date('now', '-1 month'), datetime('now'), datetime('now')),
(2, 1, 'Supplies', 'Receipt paper and bags', 85.50, date('now', '-2 weeks'), datetime('now'), datetime('now')),
(3, 2, 'Rent', 'Monthly store rent', 2500.00, date('now', '-1 month'), datetime('now'), datetime('now')),
(4, 1, 'Wages', 'Staff wages for last week', 1200.00, date('now', '-1 week'), datetime('now'), datetime('now'));

-- Insert sample promotions
INSERT OR IGNORE INTO promotions (id, name, description, type, value, startDate, endDate, isActive, createdAt, updatedAt) VALUES
(1, 'Summer Sale', '10% off all drinks', 'percentage', 10.0, date('now'), date('now', '+1 month'), true, datetime('now'), datetime('now')),
(2, 'Buy 2 Get 1 Free', 'Buy 2 chocolate bars, get 1 free', 'buy_x_get_y', 1.0, date('now'), date('now', '+2 weeks'), true, datetime('now'), datetime('now'));
