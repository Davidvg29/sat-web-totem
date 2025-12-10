
const { Client } = require('ssh2');
require("dotenv").config();
const fs = require("fs").promises;

exports.connectSSH = async () => {
    try {
        const conn = new Client();
        const passphrase = process.env.SSH_PASSPHRASE;
        const privateKey = await fs.readFile(process.env.SSH_PRIVATEKEY);
        return await new Promise((resolve, reject) => {
            conn.on('ready', () => {
                console.log('✅ Conexión SSH establecida');
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
    // let conn;
    let fileContent = ''; // Asegúrate de inicializar fileContent
    try {
        let command = `cat ${process.env.DIRECTORIO_RESPUESTA}/${nombreArchivoMasCodigoCliente}`;
        
        // conn = await exports.connectSSH();
        let exist = true
        // Usamos la promesa para manejar la ejecución del comando SSH
        do{
            await new Promise((resolve, reject) => {
            conn.exec(command, (err, stream) => {
                if (err) {
                    reject(err);  // Rechazar si hay error en la ejecución
                    return;
                }
                // Capturamos la salida estándar (STDOUT)
                stream.on('data', (data) => {
                   //console.log('STDOUT: ' + data);  // Ver qué datos estamos recibiendo
                    fileContent += data.toString().split("/\s+/");
                    fileContent = fileContent.split("\n");
                    exist=false
                });
                // Al cerrar el flujo, resolvemos la promesa
                stream.on('close', (code) => {
                   // console.log(`✅ Archivo leído con éxito`);
                    resolve();  // Resolvemos la promesa
                });
                // Capturamos los errores (STDERR)
                // stream.stderr.on('data', (data) => {
                //     console.error('STDERR: ' + data);
                // });
            });
        });
        }while(exist)
    } catch (error) {
        console.error('❌ Error al leer el archivo:', error);
        return false; // Si ocurre un error, retornamos false
    } finally {
        // if (conn) conn.end(); // Cerramos la conexión SSH
        //console.log(fileContent)
        return fileContent;
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
                    conn.end();
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
                    conn.end();
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