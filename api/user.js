const bcrypt = require('bcrypt')

module.exports = app => {
    const {existsOrError , notExistsOrError, equalOrError} = app.api.validation
    
    const encryptPassword = password => {
            const salt = bcrypt.genSaltSync(10)
            return bcrypt.hashSync(password, salt)        
    }

    const save = async (req, res) => {
        const user = { ...req.body}
        if(req.params.id) user.id = req.params.id
        try{
            existsOrError(user.name, 'Nome nao informado')
            existsOrError(user.email, 'E-mail nao informado')
            existsOrError(user.password, 'Senha nao informada')
            existsOrError(user.confirmPassword, 'Confirmacao invalida')
            equalOrError(user.password,user.confirmPassword, 'Senhas diferentes...')
            
            const userFromDB = await app.db('users')
                .where({email: user.email}).first()
                if(!user.id){
                    notExistsOrError(userFromDB, 'Usuario já cadastrado')
                }            
        } catch (msg){
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(req.body.password) // req.body.password = user.passwor
        delete user.confirmPassword

        /* Insert and update user*/
        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    
    const get = (req, res) => {
        app.db('users')
            .select('id','name','email','admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id','name','email','admin')
            .where({id: req.params.id})
            .first()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}