import multer from "multer";
import { Dropbox } from "dropbox";
import dotenv from "dotenv";

const upload = multer().single("file");
dotenv.config();
const dbx = new Dropbox({ accessToken: process.env.ACCESS_TOKEN });

export const uploadFile = async (req, res) => {
  upload(req, res, async err => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).send("Error uploading file");
    }
    const newFileName = generateUniqueFileName(req.params.name);
    const path = `/${req.params.folder}/${newFileName}`;
    try {
      const response = await dbx.filesUpload({
        path, // Путь и имя файла на Dropbox
        contents: req.file.buffer, // Используем буфер загруженного файла
        mode: { ".tag": "add" },
      });

      const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
        path,
      });
      res.send({ url: sharedLinkResponse.result.url.replace("dl=0", "raw=1") });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Error uploading file");
    }
  });
};

const generateUniqueFileName = originalFileName => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  const extension = originalFileName.split(".").pop(); // расширение файла

  const newFileName = `${timestamp}_${randomSuffix}.${extension}`;
  return newFileName;
};

export const getUrlFile = async (req, res) => {};
