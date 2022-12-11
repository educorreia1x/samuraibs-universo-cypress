import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'

describe('login', function () {

    context('quando o usuario é muito bom', function () {

        const user = {
            name: 'Teste Teste',
            email: 'testeteste@putsbox.com',
            password: 'Teste123456',
            is_provider: true
        }

        before(function () {
            cy.postUser(user)
        })

        it('deve ser logar com sucesso', function () {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            dashPage.header.userLoggedIn(user.name)
        })
    })

    context('quando o usuario é bom mas a senha esta incorreta', function () {

        let user = {
            name: 'Teste Teste',
            email: 'testeteste@putsbox.com',
            password: 'Teste123456',
            is_provider: true
        }

        before(function () {
            cy.postUser(user).then(function () {
                user.password = 'Teste123456s'
            })
        })

        it('deve notificar erro de credenciais', function () {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            const message = 'Ocorreu um erro ao fazer login, verifique suas credenciais.'
            loginPage.toast.shouldHaveText(message)
        })
    })

    context('quando o formato do email é invalido', function () {

        const emails = [
            'edu.com.br',
            '@putsbox.com',
            '@gmail.com',
            '@',
            'papito@',
            '111',
            '$^*&^*&*',
            'xpto123'
        ]

        before(function () {
            loginPage.go()
        })

        emails.forEach(function (email) {
            it('nao deve logar com o email: ' + email, function () {
                const user = { email: email, password: 'Teste123456' }

                loginPage.form(user)
                loginPage.submit()
                loginPage.alert.haveText('Informe um email válido')
            })
        })

    })

    context('quando nao preencho nenhum dos campos', function () {
        const alertMessages = [
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function () {
            loginPage.go()
            loginPage.submit()
        })

        alertMessages.forEach(function (alert) {
            it('deve exibir ' + alert.toLowerCase(), function () {
                loginPage.alert.haveText(alert)
            })
        })
    })


})