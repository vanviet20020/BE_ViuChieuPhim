const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Lỗi xóa file:', err);
        }
    });
};

module.exports = { deleteFile };
