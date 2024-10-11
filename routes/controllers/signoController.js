const fs = require('fs/promises');
const path = require('path');
const User = require('../user.model'); // Importa el modelo

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

const updateSigno = async (req, res)=>{
    const signoEditar = req.params.signoEditar;
    const {textoEditar} = req.body;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);

    const objUpdate = {
        ...objSignos,
        [signoEditar]: textoEditar
    }

    // console.log(objUpdate);
    await fs.writeFile(path.join(__dirname,'../../db/signos.json'), JSON.stringify(objUpdate, null, 2), {encoding: 'utf-8'})

    res.json({
        message: "Updated"
    })
}


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
        // Verificar si el usuario existe y la contraseña actual es correcta
        const user = await User.findOne({ username, password });

        if (user) {
            // Actualizar la contraseña
            user.password = update;
            await user.save();

            return res.json({ resultado: "Contraseña actualizada correctamente" });
        } else {
            return res.json({ resultado: "Credenciales inválidas" });
        }
    } catch (error) {
        console.error("Error actualizando contraseña:", error);
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