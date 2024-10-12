const fs = require('fs/promises');
const path = require('path');
const User = require('../user.model'); // Importa el modelo
const Signo = require('../signo.mode'); // Asegúrate de que la ruta sea correcta

const getAllSignos = async (req, res)=>{
    const signo = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const signosJson = JSON.parse(signo)
    res.json(signosJson);
}

const getOneSigno = async (req, res)=>{
    const oneSigno = req.params.signo;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);
    const result = objSignos[oneSigno];
    res.json(result)
}

const Signo = require('../models/Signo'); // Asegúrate de que la ruta sea correcta

const updateSigno = async (req, res) => {
    const { signo, genero, textoEditar } = req.body;

    try {
        // Buscar el signo específico en la base de datos
        const signoEncontrado = await Signo.findOne({ signo, genero });

        if (!signoEncontrado) {
            return res.status(404).json({ resultado: "Signo no encontrado" });
        }

        // Actualizar el texto del signo
        signoEncontrado.texto = textoEditar;
        await signoEncontrado.save();

        return res.json({ resultado: "Signo actualizado correctamente" });
    } catch (error) {
        console.error("Error actualizando el signo:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};

const compareLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password }); // Busca el usuario en MongoDB

        if (user) {
            if (user.role === 'admin') {
                return res.json({ resultado: "admin" });
            }
            return res.json({ resultado: "user" });
        } else {
            return res.json({ resultado: "Credenciales inválidas" });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};


const updatepassword = async (req, res) => {
    const { username, password, update } = req.body;

    try {
        // Buscar al usuario en MongoDB
        const user = await User.findOne({ username });

        if (!user) {
            console.log(`Usuario '${username}' no encontrado.`);
            return res.status(404).json({ resultado: "Usuario no encontrado" });
        }

        // Verificar la contraseña actual
        if (user.password !== password) {
            console.log(`Contraseña incorrecta para el usuario '${username}'.`);
            return res.status(400).json({ resultado: "Credenciales inválidas" });
        }

        // Actualizar la contraseña
        user.password = update;
        await user.save();

        console.log(`Contraseña del usuario '${username}' actualizada correctamente.`);
        return res.json({ resultado: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.log("Error al actualizar la contraseña:", error.message);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};





const crearuser = async (req, res) => {
    const { username, password, role } = req.body; // `role` será 'admin' o 'user'

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.json({ resultado: "El usuario ya existe" });
        }

        // Crear un nuevo usuario
        const newUser = new User({ username, password, role });
        await newUser.save();

        return res.json({ resultado: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error creando usuario:", error);
        return res.status(500).json({ resultado: "Error interno del servidor" });
    }
};


module.exports = {
    getAllSignos,
    getOneSigno,
    updateSigno,
    compareLogin,
    updatepassword,
    crearuser
    
}