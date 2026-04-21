-- Seed sample charities
INSERT INTO charities (name, description, image_url, is_featured, is_active) VALUES
('Hope Foundation', 'Supporting underprivileged children with education and healthcare', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c', true, true),
('Green Earth Initiative', 'Fighting climate change through reforestation projects', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09', true, true),
('Wounded Warriors', 'Supporting injured veterans and their families', 'https://images.unsplash.com/photo-1562774053-701939374585', false, true),
('Animal Rescue League', 'Protecting and rehoming abandoned animals', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e', false, true),
('Cancer Research Fund', 'Funding breakthrough cancer research', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56', true, true);

-- Seed admin user (password: Admin@123)
-- Generate hash using: bcrypt.hashSync('Admin@123', 10)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@digitalheroes.co.in', '$2a$10$rQ8mKxH5r3YvQrPJ5KxZxOvGvQZKcQxGvQZKcQxGvQZKcQxGvQZKc', 'Platform Admin', 'admin');