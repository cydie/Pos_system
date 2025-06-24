-- Create initial database tables
-- This script will be automatically executed by Prisma

-- Enable foreign key constraints for SQLite
PRAGMA foreign_keys = ON;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_pin_role ON users(pin, role);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(createdAt);
CREATE INDEX IF NOT EXISTS idx_sales_branch_id ON sales(branchId);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(userId);
CREATE INDEX IF NOT EXISTS idx_inventory_product_branch ON inventory(productId, branchId);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(productId);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(userId);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(createdAt);
