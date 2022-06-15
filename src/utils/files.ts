import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as sharp from 'sharp';
export const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return callback(new Error('Only image files are allowed!'), false);
	}
	return callback(null, true);
};

export const editFileName = async (prefix, file, verificarSiexisteEnMongo) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = '.jpg';
	const randomName = uuid();
	const filename = `${prefix}${name}-${randomName}${fileExtName}`;
	const validar = await verificarSiexisteEnMongo(filename);
	if (validar) {
		editFileName(prefix, file, verificarSiexisteEnMongo);
	} else return filename;
};

export const storageImage = () =>
	diskStorage({
		destination: './public/upload',
		filename: (req, file, cb) => cb(null, file.originalname),
	});

export const moveFile = async function (oldPath, newPath, callback = (err?) => {}) {
	const staticFiles = path.join(__dirname, '../../public/upload/');
	newPath = path.join(staticFiles, newPath);
	await sharp(path.join(staticFiles, oldPath))
		.resize(600)
		.flatten({ background: '#fff' })
		.toFormat('jpg')
		.jpeg({ quality: 80 })
		.toFile(newPath);
	deleteFile(oldPath);
};

export const deleteFile = pathDelete => {
	const staticFiles = path.join(__dirname, '../../public/upload/');
	pathDelete = path.join(staticFiles, pathDelete);
	if (fs.existsSync(pathDelete)) fs.unlink(pathDelete, () => {});
};
