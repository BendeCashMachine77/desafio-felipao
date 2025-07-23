const prompt = require('readline-sync').question; // Para entrada do usuário

class Personagem {
    constructor(nome, classe, vidaMaxima, ataque, defesa, velocidade, especial) {
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
        this.habilidadeEspecialUsada = false;
        this.roundUltimaHabilidade = -2;
        this.especial = especial; // Função especial do personagem
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
            const cura = Math.floor(this.vidaMaxima * 0.4);
            this.vidaAtual = Math.min(this.vidaMaxima, this.vidaAtual + cura);
            this.pocoesUsadas++;
            return cura;
        }
        return 0;
    }

    usarEspecial(alvo, roundAtual) {
        // Só pode usar se não usou no round anterior
        if ((roundAtual - this.roundUltimaHabilidade) > 1) {
            return this.especial(this, alvo, roundAtual);
        }
        return null;
    }

    atacar(alvo, roundAtual = 0) {
        // Chance de usar especial (25% se disponível)
        if (Math.random() < 0.25) {
            const resultadoEspecial = this.usarEspecial(alvo, roundAtual);
            if (resultadoEspecial) {
                this.roundUltimaHabilidade = roundAtual;
                return resultadoEspecial;
            }
        }

        const chanceCritico = Math.random() < 0.15;
        const chanceBloquear = Math.random() < 0.2;

        if (chanceBloquear) {
            return { dano: 0, critico: false, bloqueado: true, especial: false, nomeEspecial: "" };
        }

        let dano = this.ataque - alvo.defesa;
        dano = Math.max(1, dano);

        if (chanceCritico) {
            dano *= 2;
        }

        alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);

        return { dano, critico: chanceCritico, bloqueado: false, especial: false, nomeEspecial: "" };
    }

    estaVivo() {
        return this.vidaAtual > 0;
    }

    resetarParaProximoRound() {
        this.vidaAtual = this.vidaMaxima;
        this.pocoesUsadas = 0;
    }
}

// Funções de habilidades especiais
function chuvaFlechas(self, alvo, roundAtual) {
    const chanceBloquear = Math.random() < 0.1;
    if (chanceBloquear) {
        return { dano: 0, critico: true, bloqueado: true, especial: true, nomeEspecial: "Chuva de Flechas" };
    }
    let dano = (self.ataque * 1.5) - alvo.defesa;
    dano = Math.max(1, dano) * 2;
    alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
    return { dano, critico: true, bloqueado: false, especial: true, nomeEspecial: "Chuva de Flechas" };
}

function investidaLancada(self, alvo, roundAtual) {
    const chanceBloquear = Math.random() < 0.1;
    if (chanceBloquear) {
        return { dano: 0, critico: true, bloqueado: true, especial: true, nomeEspecial: "Investida Lancada" };
    }
    let dano = (self.ataque * 1.5) - alvo.defesa;
    dano = Math.max(1, dano) * 2;
    alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
    return { dano, critico: true, bloqueado: false, especial: true, nomeEspecial: "Investida Lancada" };
}

function explosaoMagica(self, alvo, roundAtual) {
    const chanceBloquear = Math.random() < 0.1;
    if (chanceBloquear) {
        return { dano: 0, critico: true, bloqueado: true, especial: true, nomeEspecial: "Explosão Mágica" };
    }
    let dano = (self.ataque * 1.5) - alvo.defesa;
    dano = Math.max(1, dano) * 2;
    alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
    return { dano, critico: true, bloqueado: false, especial: true, nomeEspecial: "Explosão Mágica" };
}

function golpeEspada(self, alvo, roundAtual) {
    const chanceBloquear = Math.random() < 0.1;
    if (chanceBloquear) {
        return { dano: 0, critico: true, bloqueado: true, especial: true, nomeEspecial: "Golpe de Espada" };
    }
    let dano = (self.ataque * 1.5) - alvo.defesa;
    dano = Math.max(1, dano) * 2;
    alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
    return { dano, critico: true, bloqueado: false, especial: true, nomeEspecial: "Golpe de Espada" };
}

function furiaMarcial(self, alvo, roundAtual) {
    const chanceBloquear = Math.random() < 0.1;
    if (chanceBloquear) {
        return { dano: 0, critico: true, bloqueado: true, especial: true, nomeEspecial: "Fúria Marcial" };
    }
    let dano = (self.ataque * 1.5) - alvo.defesa;
    dano = Math.max(1, dano) * 2;
    alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
    return { dano, critico: true, bloqueado: false, especial: true, nomeEspecial: "Fúria Marcial" };
}

function tempestadeShuriken(self, alvo, roundAtual) {
    const chanceBloquear = Math.random() < 0.1;
    if (chanceBloquear) {
        return { dano: 0, critico: true, bloqueado: true, especial: true, nomeEspecial: "Tempestade de Shuriken" };
    }
    let dano = (self.ataque * 1.5) - alvo.defesa;
    dano = Math.max(1, dano) * 2;
    alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
    return { dano, critico: true, bloqueado: false, especial: true, nomeEspecial: "Tempestade de Shuriken" };
}

// Lista de personagens balanceados
const personagens = [
    new Personagem("Artemis", "Arqueira", 100, 25, 8, 12, chuvaFlechas),
    new Personagem("Pikeman", "Lanceiro", 120, 22, 12, 8, investidaLancada),
    new Personagem("Merlin", "Mago", 105, 24, 9, 11, explosaoMagica),
    new Personagem("Leon", "Guerreiro", 115, 23, 11, 9, golpeEspada),
    new Personagem("Shifu", "Monge", 110, 22, 10, 13, furiaMarcial),
    new Personagem("Akira", "Ninja", 95, 26, 7, 14, tempestadeShuriken)
];

class SistemaCombate {
    constructor() {
        this.resultadosRounds = [];
        this.roundAtual = 0;
    }

    exibirBarraVida(personagem) {
        const porcentagem = (personagem.vidaAtual / personagem.vidaMaxima) * 100;
        const barras = Math.floor(porcentagem / 5);
        const vida = "█".repeat(barras) + "░".repeat(20 - barras);
        return `${personagem.nome}: [${vida}] ${personagem.vidaAtual}/${personagem.vidaMaxima} HP`;
    }

    escolherPersonagem(msg) {
        console.log(msg);
        personagens.forEach((p, i) => {
            console.log(`${i + 1} - ${p.nome} (${p.classe})`);
        });
        let escolha;
        do {
            escolha = parseInt(prompt("Escolha o número do personagem: "));
        } while (isNaN(escolha) || escolha < 1 || escolha > personagens.length);
        // Retorna uma cópia do personagem para não alterar o original
        const p = personagens[escolha - 1];
        return new Personagem(p.nome, p.classe, p.vidaMaxima, p.ataque, p.defesa, p.velocidade, p.especial);
    }

    simularRound(numeroRound, p1, p2) {
        this.roundAtual = numeroRound;
        console.log(`\n🏹 ===== ROUND ${numeroRound} ===== ⚔️`);
        console.log(`${p1.nome} (${p1.classe}) VS ${p2.nome} (${p2.classe})`);

        let turno = 1;
        const logRound = [];

        let primeiro = p1.velocidade >= p2.velocidade ? p1 : p2;
        let segundo = primeiro === p1 ? p2 : p1;

        while (p1.estaVivo() && p2.estaVivo()) {
            console.log(`\n--- Turno ${turno} ---`);
            console.log(this.exibirBarraVida(p1));
            console.log(this.exibirBarraVida(p2));

            this.executarTurno(primeiro, segundo, logRound);
            if (!segundo.estaVivo()) break;

            this.executarTurno(segundo, primeiro, logRound);

            turno++;
        }

        const vencedor = p1.estaVivo() ? p1 : p2;
        const perdedor = vencedor === p1 ? p2 : p1;

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

        p1.resetarParaProximoRound();
        p2.resetarParaProximoRound();

        return vencedor;
    }

    executarTurno(atacante, defensor, log) {
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

        if (resultado.bloqueado && resultado.especial) {
            mensagem = `🛡️ ${defensor.nome} conseguiu se proteger da habilidade especial "${resultado.nomeEspecial}" de ${atacante.nome}!`;
        } else if (resultado.bloqueado) {
            mensagem = `🛡️ ${defensor.nome} bloqueou o ataque de ${atacante.nome}!`;
        } else if (resultado.especial) {
            mensagem = `✨ ${atacante.nome} usou "${resultado.nomeEspecial}" causando ${resultado.dano} de dano em ${defensor.nome}!`;
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

        console.log("\n🏆 RESULTADOS DOS ROUNDS:");
        this.resultadosRounds.forEach(resultado => {
            console.log(`Round ${resultado.round}: ${resultado.vencedor} derrotou ${resultado.perdedor}`);
        });
    }

    iniciarTorneio() {
        console.log("🏟️ BEM-VINDOS AO GRANDE TORNEIO!");
        console.log("Selecione os personagens para cada rodada. Melhor de 3 rounds!\n");

        for (let i = 1; i <= 3; i++) {
            console.log(`\n--- Seleção para o Round ${i} ---`);
            const p1 = this.escolherPersonagem("Escolha o personagem 1:");
            let p2;
            do {
                p2 = this.escolherPersonagem("Escolha o personagem 2:");
                if (p2.nome === p1.nome) {
                    console.log("Escolha personagens diferentes!");
                }
            } while (p2.nome === p1.nome);

            this.simularRound(i, p1, p2);
        }

        this.exibirEstatisticasFinais();
    }
}

// Executar o torneio
const torneio = new SistemaCombate();
torneio.iniciarTorneio();