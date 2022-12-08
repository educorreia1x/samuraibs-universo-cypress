import signupPage from '../support/pages/signup'
describe('cadastro', function () {

    context('quando o usuario é novato', function () {
        const user = {
            name: 'Edu',
            email: 'qa10@putsbox.com',
            password: 'Teste123456'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar com sucesso', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        })
    })

    context('quando o email ja existe', function () {
        const user = {
            name: 'Edu',
            email: 'qa700@putsbox.com',
            password: 'Teste123456',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('nao deve cadastrar o usuario', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email é incorrecto', function () {
        const user = {
            name: 'Email incorreto',
            email: 'qa10putsbox.com',
            password: 'Teste123456'
        }

        it('deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('quando a senha é muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('nao deve cadastrar com a senha: ' + p, function () {

                const user = { name: 'John', email: 'john@example.com', password: p }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context.only('quando nao preencho nenhum dos campos', function () {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function() {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function(alert) {
            it('deve exibir ' + alert.toLowerCase(), function(){
                signupPage.alertHaveText(alert)
            })
        })
    })
})