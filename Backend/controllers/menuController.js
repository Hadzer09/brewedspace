const Menu = require('../models/Menu');

// =========================================================================
// 1. Ambil Semua Menu
// =========================================================================
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    const formattedMenus = menus.map(item => ({
      _id: item._id,
      id: item._id,
      title: item.title,
      nama: item.title,
      desc: item.desc || '',
      price: item.price,
      harga: item.price,
      img: item.img || '', // Path gambar dari database
      category: item.category,
      kategori: item.category
    }));
    res.json(formattedMenus);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data menu", error: error.message });
  }
};

// =========================================================================
// 2. Tambah Menu Baru (DENGAN DUKUNGAN FILE UPLOAD)
// =========================================================================
const createMenu = async (req, res) => {
  try {
    // Tangkap teks dari req.body
    const titleInput = req.body.title || req.body.nama;
    const priceInput = req.body.price || req.body.harga;
    const categoryInput = req.body.category || req.body.kategori;
    const descInput = req.body.description || req.body.desc || '';
    
    // Tangkap file dari req.file (disediakan oleh middleware multer)
    // Jika ada file, simpan path-nya. Jika tidak, kosongkan.
    const imgPath = req.file ? `/uploads/${req.file.filename}` : '';

    if (!titleInput || !priceInput) {
      return res.status(400).json({ message: "Nama produk dan harga wajib diisi!" });
    }

    const cleanPrice = Number(priceInput);
    if (isNaN(cleanPrice)) {
      return res.status(400).json({ message: "Format harga harus berupa angka murni valid!" });
    }

    const newMenu = new Menu({ 
      title: titleInput, 
      desc: descInput, 
      price: cleanPrice, 
      img: imgPath, 
      category: categoryInput || 'Minuman' 
    });
    
    await newMenu.save();

    // Mengembalikan objek yang sinkron dengan struktur frontend
    res.status(201).json({
      _id: newMenu._id,
      id: newMenu._id,
      title: newMenu.title,
      nama: newMenu.title,
      desc: newMenu.desc,
      price: newMenu.price,
      harga: newMenu.price,
      img: newMenu.img,
      category: newMenu.category,
      kategori: newMenu.category
    });

  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan menu", error: error.message });
  }
};

// =========================================================================
// 3. Update Menu Berdasarkan ID
// =========================================================================
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Data update bisa dari body (text) atau file (jika ada update gambar)
    const updateData = {
      title: req.body.title || req.body.nama,
      desc: req.body.desc || req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined,
      category: req.body.category || req.body.kategori
    };

    // Jika user mengupload file baru saat update, update field 'img'
    if (req.file) {
      updateData.img = `/uploads/${req.file.filename}`;
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }

    res.json({ message: "Menu berhasil diperbarui", data: updatedMenu });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui menu", error: error.message });
  }
};

// =========================================================================
// 4. Hapus Menu Berdasarkan ID
// =========================================================================
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }

    res.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus menu", error: error.message });
  }
};

module.exports = { getAllMenus, createMenu, updateMenu, deleteMenu };