class Personagem {
    constructor(nome, classe, vidaMaxima, ataque, defesa, velocidade) {
        this.nome = nome;
        this.classe = classe;
        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaMaxima;
        this.ataque = ataque;
        this.defesa = defesa;
        this.velocidade = velocidade;
        this.experiencia = 0;
        this.vitorias = 0;
        this.derrotas = 0;
        this.pocoesUsadas = 0;
        this.maxPocoes = 2;
        // Adicionar propriedades para habilidade especial
        this.habilidadeEspecialUsada = false;
        this.roundUltimaHabilidade = -2; // Inicializa permitindo usar no round 1
    }

    calcularNivel() {
        const vitorias = this.vitorias;
        
        if (vitorias < 10) return "Ferro";
        if (vitorias >= 11 && vitorias <= 20) return "Bronze";
        if (vitorias >= 21 && vitorias <= 50) return "Prata";
        if (vitorias >= 51 && vitorias <= 80) return "Ouro";
        if (vitorias >= 81 && vitorias <= 90) return "Diamante";
        if (vitorias >= 91 && vitorias <= 100) return "Lendário";
        if (vitorias >= 101) return "Imortal";
    }

    usarPocao() {
        if (this.pocoesUsadas < this.maxPocoes && this.vidaAtual < this.vidaMaxima) {
            const cura = Math.floor(this.vidaMaxima * 0.4); // Cura 40% da vida máxima
            this.vidaAtual = Math.min(this.vidaMaxima, this.vidaAtual + cura);
            this.pocoesUsadas++;
            return cura;
        }
        return 0;
    }

    // Adicionar método para Artemis usar Chuva de Flechas
    usarChuvaFlechas(alvo, roundAtual) {
        // Verifica se pode usar (não usou no round anterior)
        if (this.nome === "Artemis" && (roundAtual - this.roundUltimaHabilidade) > 1) {
            const chanceBloquear = Math.random() < 0.1; // Chance reduzida de bloquear (10%)
            
            if (chanceBloquear) {
                return { dano: 0, critico: true, bloqueado: true, chuvaFlechas: true };
            }

            // Chuva de Flechas sempre é crítico e causa mais dano
            let dano = (this.ataque * 1.5) - alvo.defesa; // 50% mais dano base
            dano = Math.max(1, dano);
            dano *= 2; // Multiplicador crítico

            alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
            this.roundUltimaHabilidade = roundAtual;
            
            return { dano, critico: true, bloqueado: false, chuvaFlechas: true };
        }
        return null;
    }

    atacar(alvo, roundAtual = 0) {
        // Chance de usar Chuva de Flechas (25% se disponível)
        if (this.nome === "Artemis" && Math.random() < 0.25) {
            const habilidadeEspecial = this.usarChuvaFlechas(alvo, roundAtual);
            if (habilidadeEspecial) {
                return habilidadeEspecial;
            }
        }

        const chanceCritico = Math.random() < 0.15; // 15% de chance de crítico
        const chanceBloquear = Math.random() < 0.2; // 20% de chance de bloquear
        
        if (chanceBloquear) {
            return { dano: 0, critico: false, bloqueado: true, chuvaFlechas: false };
        }

        let dano = this.ataque - alvo.defesa;
        dano = Math.max(1, dano); // Dano mínimo de 1

        if (chanceCritico) {
            dano *= 2;
        }

        alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
        
        return { dano, critico: chanceCritico, bloqueado: false, chuvaFlechas: false };
    }

    estaVivo() {
        return this.vidaAtual > 0;
    }

    resetarParaProximoRound() {
        this.vidaAtual = this.vidaMaxima;
        this.pocoesUsadas = 0;
        // Não resetar roundUltimaHabilidade para manter controle entre rounds
    }
}

class SistemaCombate {
    constructor() {
        this.artemis = new Personagem("Artemis", "Arqueira", 100, 25, 8, 12);
        this.pikeman = new Personagem("Pikeman", "Lanceiro", 120, 22, 12, 8);
        this.resultadosRounds = [];
        this.roundAtual = 0; // Adicionar controle do round atual
    }

    exibirBarraVida(personagem) {
        const porcentagem = (personagem.vidaAtual / personagem.vidaMaxima) * 100;
        const barras = Math.floor(porcentagem / 5);
        const vida = "█".repeat(barras) + "░".repeat(20 - barras);
        return `${personagem.nome}: [${vida}] ${personagem.vidaAtual}/${personagem.vidaMaxima} HP`;
    }

    simularRound(numeroRound) {
        this.roundAtual = numeroRound; // Atualizar round atual
        console.log(`\n🏹 ===== ROUND ${numeroRound} ===== ⚔️`);
        console.log(`${this.artemis.nome} (${this.artemis.classe}) VS ${this.pikeman.nome} (${this.pikeman.classe})`);
        
        // Mostrar status da habilidade especial
        const podeUsarHabilidade = (numeroRound - this.artemis.roundUltimaHabilidade) > 1;
        console.log(`🏹 Chuva de Flechas: ${podeUsarHabilidade ? "Disponível" : "Em Recarga"}`);
        
        let turno = 1;
        const logRound = [];

        // Determinar quem ataca primeiro baseado na velocidade
        let primeiro = this.artemis.velocidade >= this.pikeman.velocidade ? this.artemis : this.pikeman;
        let segundo = primeiro === this.artemis ? this.pikeman : this.artemis;

        while (this.artemis.estaVivo() && this.pikeman.estaVivo()) {
            console.log(`\n--- Turno ${turno} ---`);
            console.log(this.exibirBarraVida(this.artemis));
            console.log(this.exibirBarraVida(this.pikeman));

            // Primeiro atacante
            this.executarTurno(primeiro, segundo, logRound);
            if (!segundo.estaVivo()) break;

            // Segundo atacante
            this.executarTurno(segundo, primeiro, logRound);
            
            turno++;
        }

        const vencedor = this.artemis.estaVivo() ? this.artemis : this.pikeman;
        const perdedor = vencedor === this.artemis ? this.pikeman : this.artemis;

        vencedor.vitorias++;
        vencedor.experiencia += 100;
        perdedor.derrotas++;
        perdedor.experiencia += 25;

        console.log(`\n🏆 ${vencedor.nome} venceu o Round ${numeroRound}!`);
        
        this.resultadosRounds.push({
            round: numeroRound,
            vencedor: vencedor.nome,
            perdedor: perdedor.nome,
            log: logRound
        });

        // Reset para próximo round
        this.artemis.resetarParaProximoRound();
        this.pikeman.resetarParaProximoRound();

        return vencedor;
    }

    executarTurno(atacante, defensor, log) {
        // Chance de usar poção (30% se vida < 50%)
        if (atacante.vidaAtual < atacante.vidaMaxima * 0.5 && Math.random() < 0.3) {
            const cura = atacante.usarPocao();
            if (cura > 0) {
                const mensagem = `💚 ${atacante.nome} usou uma poção e recuperou ${cura} HP!`;
                console.log(mensagem);
                log.push(mensagem);
                return;
            }
        }

        const resultado = atacante.atacar(defensor, this.roundAtual);
        let mensagem = "";

        if (resultado.bloqueado && resultado.chuvaFlechas) {
            mensagem = `🛡️ ${defensor.nome} conseguiu se proteger da Chuva de Flechas de ${atacante.nome}!`;
        } else if (resultado.bloqueado) {
            mensagem = `🛡️ ${defensor.nome} bloqueou o ataque de ${atacante.nome}!`;
        } else if (resultado.chuvaFlechas) {
            mensagem = `🌧️🏹 CHUVA DE FLECHAS! ${atacante.nome} desferiu um ataque devastador causando ${resultado.dano} de dano em ${defensor.nome}!`;
        } else if (resultado.critico) {
            mensagem = `💥 CRÍTICO! ${atacante.nome} causou ${resultado.dano} de dano em ${defensor.nome}!`;
        } else {
            mensagem = `⚔️ ${atacante.nome} atacou ${defensor.nome} causando ${resultado.dano} de dano!`;
        }

        console.log(mensagem);
        log.push(mensagem);
    }

    calcularSaldoRankeadas(personagem) {
        return personagem.vitorias - personagem.derrotas;
    }

    exibirEstatisticasFinais() {
        console.log("\n" + "=".repeat(60));
        console.log("📊 ESTATÍSTICAS FINAIS DO TORNEIO");
        console.log("=".repeat(60));

        // Resultados dos rounds
        console.log("\n🏆 RESULTADOS DOS ROUNDS:");
        this.resultadosRounds.forEach(resultado => {
            console.log(`Round ${resultado.round}: ${resultado.vencedor} derrotou ${resultado.perdedor}`);
        });

        // Campeão do torneio
        const campeao = this.artemis.vitorias > this.pikeman.vitorias ? this.artemis : 
                        this.pikeman.vitorias > this.artemis.vitorias ? this.pikeman : null;

        if (campeao) {
            console.log(`\n👑 CAMPEÃO DO TORNEIO: ${campeao.nome}!`);
        } else {
            console.log("\n🤝 EMPATE! Ambos os lutadores mostraram igual habilidade!");
        }

        // Estatísticas detalhadas
        [this.artemis, this.pikeman].forEach(personagem => {
            const saldo = this.calcularSaldoRankeadas(personagem);
            const nivel = personagem.calcularNivel();
            
            console.log(`\n⚔️ ${personagem.nome} (${personagem.classe})`);
            if (personagem.nome === "Artemis") {
                console.log(`   🏹 Habilidade Especial: Chuva de Flechas`);
            }
            console.log(`   Vitórias: ${personagem.vitorias}`);
            console.log(`   Derrotas: ${personagem.derrotas}`);
            console.log(`   Saldo: ${saldo}`);
            console.log(`   Experiência: ${personagem.experiencia} XP`);
            console.log(`   Nível: ${nivel}`);
            console.log(`   O Herói tem saldo de ${saldo} e está no nível ${nivel}`);
        });
    }

    iniciarTorneio() {
        console.log("🏟️ BEM-VINDOS AO GRANDE TORNEIO!");
        console.log("Artemis a Arqueira vs Pikeman o Lanceiro");
        console.log("Melhor de 3 rounds!\n");

        console.log("📋 ESTATÍSTICAS INICIAIS:");
        console.log(`${this.artemis.nome}: HP:${this.artemis.vidaMaxima} ATK:${this.artemis.ataque} DEF:${this.artemis.defesa} SPD:${this.artemis.velocidade}`);
        console.log(`🏹 Habilidade Especial: Chuva de Flechas (Crítico garantido, não pode usar em rounds consecutivos)`);
        console.log(`${this.pikeman.nome}: HP:${this.pikeman.vidaMaxima} ATK:${this.pikeman.ataque} DEF:${this.pikeman.defesa} SPD:${this.pikeman.velocidade}`);

        // Simular 3 rounds
        for (let i = 1; i <= 3; i++) {
            this.simularRound(i);
        }

        this.exibirEstatisticasFinais();
    }
}

// Executar o torneio
const torneio = new SistemaCombate();
torneio.iniciarTorneio();