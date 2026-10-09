
const { Client } = require('ssh2');
require("dotenv").config();
const fs = require("fs").promises;

const MAX_VIDA_CONEXION_MS = 150000; // una consulta completa puede tardar hasta ~120s entre lecturas

exports.connectSSH = async () => {
    try {
        const conn = new Client();
        const passphrase = process.env.SSH_PASSPHRASE;
        const privateKey = await fs.readFile(process.env.SSH_PRIVATEKEY);
        return await new Promise((resolve, reject) => {
            conn.on('ready', () => {
                console.log('✅ Conexión SSH establecida');
                // cierre automático de seguridad por si alguna petición se cuelga sin cerrar la conexión
                const cierreSeguridad = setTimeout(() => conn.end(), MAX_VIDA_CONEXION_MS);
                conn.once('close', () => clearTimeout(cierreSeguridad));
                resolve(conn);
            }).on('error', (err) => {
                console.error('❌ Error de conexión SSH:', err);
                reject(err);
            }).connect({
                host: process.env.SSH_HOST, 
                port: process.env.SSH_PORT, 
                username: process.env.SSH_USER, 
                privateKey,
                passphrase,
                readyTimeout: 10000,
            });
        });
    } catch (error) {
        console.error('❌ Error general de SSH:', error);
        throw error;
    }
}

exports.crearArchivoRemoto = async (nombreArchivoMasCodigoCliente, codInmueble, conn) => {
    try {
        // conn = await exports.connectSSH();
        let command = `echo "${codInmueble}" > /${process.env.DIRECTORIO_SOLICITUD}/${nombreArchivoMasCodigoCliente}`;
        await new Promise((resolve, reject) => {
            conn.exec(command, (err, stream) => {
                if (err) {
                    reject(err);  // Rechazar si hay error en la ejecución
                    return;
                }
                // Cuando el comando termine
                stream.on('close', (code) => {
                    //console.log(`✅ Archivo creado con código de salida: ${code}`);
                    resolve();
                });
                // Mostrar la salida estándar, los datos (STDOUT)
                stream.on('data', (data) => {
                    //console.log('STDOUT: ' + data);
                });
                // Mostrar los errores (STDERR)
                // stream.stderr.on('data', (data) => {
                //     console.error('STDERR: ' + data);
                // });
            });
        });
    } catch (error) {
        console.error('❌ Error al crear el archivo:', error);
        return false
    } finally {
        // if (conn) conn.end();
        return true
    }
}

exports.leerArchivoRemotoTes = async (nombreArchivoMasCodigoCliente, conn) => {
    let fileContent = '';
    const TIMEOUT_MS = 30000; // tiempo máximo de espera en ms (10 segundos)
    const start = Date.now(); // guardamos el momento de inicio

    try {
        let command = `cat ${process.env.DIRECTORIO_RESPUESTA}/${nombreArchivoMasCodigoCliente}`;
        let exist = true;

        do {
            // Si ya pasó el tiempo máximo, cortamos
            if (Date.now() - start > TIMEOUT_MS) {
                console.error("Tiempo de espera agotado");
                break;
            }

            await new Promise((resolve, reject) => {
                conn.exec(command, (err, stream) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    stream.on('data', (data) => {
                        //console.log('STDOUT: ' + data);
                        fileContent += data.toString();
                        exist = false; // encontramos contenido, salimos
                    });
                    stream.on('close', () => {
                        resolve();
                    });
                    // stream.stderr.on('data', (data) => {
                    //     console.error('STDERR: ' + data);
                    // });
                });
            });

            // Pequeña espera entre intentos para no sobrecargar
            if (exist) {
                await new Promise(r => setTimeout(r, 500)); 
            }

        } while (exist);

    } catch (error) {
        console.error('❌ Error al leer el archivo:', error);
        return false;
    } finally {
        //console.log(fileContent);

        // Interpretamos la respuesta solo si hay contenido
        if (!fileContent.trim()) {
            return "timeout"; // nada encontrado dentro del tiempo límite
        }

        if (fileContent.trim() == "0000") return true;
        else if (fileContent.trim() == "0001") return '0001';
        else if (fileContent.trim() == "0002") return false;
        // else if (["0004", "0006"].includes(fileContent.trim())) return "0004";
        // else if (fileContent.trim() == "0011") return "0011";
        // else if (fileContent.trim() == "0090") return "0090";
        // else if (parseInt(fileContent.trim()) >= 3) return "0003";
        else return false;
    }
};

exports.leerArchivoRemotoTxt = async (nombreArchivoMasCodigoCliente, conn) => {
    const TIMEOUT_MS = 30000;        // tiempo maximo de espera a que aparezca el archivo
    const INTERVALO_REINTENTO = 500; // pausa entre intentos
    const start = Date.now();
    const command = `cat ${process.env.DIRECTORIO_RESPUESTA}/${nombreArchivoMasCodigoCliente}`;

    try {
        while (Date.now() - start < TIMEOUT_MS) {
            // cada intento acumula en su propio buffer; el archivo puede llegar en varios chunks
            const contenido = await new Promise((resolve, reject) => {
                conn.exec(command, (err, stream) => {
                    if (err) return reject(err);
                    let data = '';
                    stream.on('data', (chunk) => { data += chunk.toString(); });
                    // se consume stderr (ej: "No such file") para que el canal no quede trabado
                    stream.stderr.on('data', () => {});
                    stream.on('error', reject);
                    stream.on('close', () => resolve(data));
                });
            });

            // el archivo existe y tiene contenido: se devuelve un array de lineas
            if (contenido.length > 0) return contenido.split("\n");

            await new Promise(r => setTimeout(r, INTERVALO_REINTENTO));
        }

        console.error(`Tiempo de espera agotado leyendo ${nombreArchivoMasCodigoCliente}`);
        return false;
    } catch (error) {
        console.error('❌ Error al leer el archivo:', error);
        return false;
    }
};

exports.getFacturasVigentesSAT = async (nombreArchivo, conn) => {
    const fs = require("fs");
    const path = require("path");
    // let conn;
    let namePDF;

    try {
        // conn = await exports.connectSSH();
        namePDF = `${process.env.DIRECTORIO_RESPUESTA}/${nombreArchivo}`;

        const localFolderPath = path.join(__dirname, "../cache");
        const localFilePath = path.join(localFolderPath, nombreArchivo);

        if (!fs.existsSync(localFolderPath)) {
            fs.mkdirSync(localFolderPath, { recursive: true });
        }

        const success = await new Promise((resolve, reject) => {
            conn.exec(`cat ${namePDF}`, (err, stream) => {
                if (err) {
                    console.error('❌ Error al ejecutar comando remoto:', err);
                    return reject(false);
                }

                let fileData = Buffer.alloc(0);

                stream.on('data', (chunk) => {
                    fileData = Buffer.concat([fileData, chunk]);
                });

                stream.on('close', () => {
                    fs.writeFile(localFilePath, fileData, (err) => {
                        // conn.end();
                        if (err) {
                            console.error('❌ Error al guardar el archivo localmente:', err);
                            return reject(false);
                        } else {
                            console.log(`✅ Archivo descargado con éxito: ${localFilePath}`);
                            return resolve(true);
                        }
                    });
                });

                stream.on('error', (streamErr) => {
                    console.error("❌ Error en el stream:", streamErr);
                    return reject(false);
                });
            });
        });

        return success;

    } catch (error) {
        console.error('❌ Error general al obtener archivo PDF:', error);
        return false;
    }
};