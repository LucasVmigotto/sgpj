# SGPJ - Sistema Gerenciador de Processos Jurídicos

![SGPJ Lint CI](https://github.com/LucasVmigotto/sgpj/workflows/SGPJ%20Lint%20CI/badge.svg?branch=ci%2Fgithub-workflows)![SGPJ Test CI](https://github.com/LucasVmigotto/sgpj/workflows/SGPJ%20Test%20CI/badge.svg?branch=dev)[![Maintainability](https://api.codeclimate.com/v1/badges/e142e4e9b68e9122302f/maintainability)](https://codeclimate.com/github/LucasVmigotto/sgpj/maintainability)[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Sistema que visa auxiliar advogados e demais envolvidos no âmbito do direito na organização, gestão de clientes e processos os quais estejam contatando/participando.

## Desenvolvimento

1. Clone o repositório e acesse-o
    * Por `HTTPS`

        ```bash
        git clone https://github.com/LucasVmigotto/sgpj.git
        cd sgpj
        ```

    * Por `ssh`

        ```bash
        git clone git@github.com:LucasVmigotto/sgpj.git
        cd sgpj
        ```

2. Renomeie os arquivos
    * `.env.exmaple` => `.env`
    * `packages/api/.env.exmaple` => `packages/api/.env`
    * `packages/app/.env.exmaple` => `packages/app/.env`
    > Caso necessário, customize as variáveis internas

3. Instale as dependências

    ```bash
    yarn
    ```

4. Utilize os serviços

    * **_pgcli_**:

        ```bash
        docker-compose run --rm pgcli
        ```

    * **_API_**:
        * Subir o serviço:

            ```bash
            docker-compose up api
            ```

        * Utilizar a `CLI`:

            ```bash
            docker-compose run --rm --service-ports api bash
            ```

            * Comandos disponíveis da **_API_**:
                1. _Code Linter_

                    ```bash
                    yarn lint
                    ```

                2. Testes unitários (sem geração de _coverage_)

                    ```bash
                    yarn test
                    ```

                3. Testes unitários (com geração de _coverage_)

                    ```bash
                    yarn test:coverage
                    ```

                4. Testes unitários (função _watch file_)

                    ```bash
                    yarn test:watch <arquivo>
                    ```

    * **_APP_**:
        * Subir o serviço:

            ```bash
            docker-compose up app
            ```

        * Utilizar a `CLI`:

            ```bash
            docker-compose run --rm --service-ports app bash
            ```
