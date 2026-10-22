// Convierte las imágenes JPG/PNG del proyecto a WebP y las redimensiona al tamaño en que se usan.
// Uso: npm run images
// Los originales se mueven a originals/ (ignorada por git), así se puede volver a generar todo.
import fs from "fs"
import path from "path"
import sharp from "sharp"

const backup = "originals"

// Carpeta y ancho máximo (en px) según dónde se muestran las imágenes.
// Se usa el doble del tamaño visible para pantallas de alta densidad.
const targets = [
    { dir: "public/products", maxWidth: 800 },
    { dir: "public/login", maxWidth: 1536 },
    { dir: "src/assets", maxWidth: 1600 }, // banners de borde a borde
    { dir: "src/assets/categories", maxWidth: 800 },
    { dir: "src/assets/brand", maxWidth: 256 }, // el logo se muestra a 96 px como máximo
]

for (const { dir, maxWidth } of targets) {
    if (!fs.existsSync(dir)) continue

    for (const file of fs.readdirSync(dir)) {
        if (!/\.(jpe?g|png)$/i.test(file)) continue // solo convierte jpg/png

        const source = path.join(dir, file)
        const name = path.parse(file).name

        await sharp(source)
            .rotate()
            .resize({ width: maxWidth, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(dir, `${name}.webp`))

        const backupDir = path.join(backup, dir)
        fs.mkdirSync(backupDir, { recursive: true })
        fs.renameSync(source, path.join(backupDir, file))
        console.log("OK", source)
    }
}
