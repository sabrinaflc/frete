document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("frete-form");
    const cepOrigemInput = document.getElementById("cep-origem");
    const cepDestinoInput = document.getElementById("cep-destino");
    const calcularFreteButton = document.getElementById("calcular-frete");
    const resultadoFrete = document.getElementById("resultado-frete");

    cepOrigemInput.addEventListener('input', function() {
        const cepValue = cepOrigemInput.value.trim();
        
        if (cepValue.length === 5) {
            cepOrigemInput.value = cepValue.slice(0, 5) + '-' + cepValue.slice(5);
        }
    });

    cepDestinoInput.addEventListener('input', function() {
        const cepValue = cepDestinoInput.value.trim();
        
        if (cepValue.length === 5) {
            cepDestinoInput.value = cepValue.slice(0, 5) + '-' + cepValue.slice(5);
        }
    });

    calcularFreteButton.addEventListener("click", async function () {
        const cepOrigem = cepOrigemInput.value;
        const cepDestino = cepDestinoInput.value;

        // URL da API ViaCEP
        const urlOrigem = `https://viacep.com.br/ws/${cepOrigem}/json/`;
        const urlDestino = `https://viacep.com.br/ws/${cepDestino}/json/`;

        try {
            // Fazendo a solicitação HTTP para a API ViaCEP para obter informações dos CEPs
            const responseOrigem = await fetch(urlOrigem);
            const responseDestino = await fetch(urlDestino);

            const dataOrigem = await responseOrigem.json();
            const dataDestino = await responseDestino.json();

            // Verificando se os CEPs estão na mesma cidade
            const mesmaCidade = dataOrigem.localidade === dataDestino.localidade;

            // Definindo o tempo de entrega com base na cidade
            let tempoDeEntrega = mesmaCidade ? "Entre 1 e 2 dias" : "10 dias";

            // Calculando o valor do frete com base no tempo de entrega
            const valorBase = 2.0;
            const acrescimoPorDia = 5.0;

            const valorDoFrete = valorBase + acrescimoPorDia * (mesmaCidade ? 1 : 10);

            // Exibir o resultado na página
            resultadoFrete.innerHTML = `
                <p>Origem: ${dataOrigem.logradouro}, ${dataOrigem.localidade} - ${dataOrigem.uf}</p>
                <p>Destino: ${dataDestino.logradouro}, ${dataDestino.localidade} - ${dataDestino.uf}</p>
                <p>Tempo de Entrega: ${tempoDeEntrega}</p>
                <p>Valor do Frete: R$ ${valorDoFrete.toFixed(2)}</p>
            `;

            resultadoFrete.style.display = "block";
        } catch (error) {
            console.error("Erro ao obter informações dos CEPs:", error);
        }
    });
});
