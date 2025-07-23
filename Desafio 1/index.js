// Classe base para personagens
class Personagem {
    constructor(nome, classe, vida = 100, ataque, defesa, xp = 0) {
        this.nome = nome;
        this.classe = classe;
        this.vidaMaxima = vida;
        this.vidaAtual = vida;
        this.ataque = ataque;
        this.defesa = defesa;
        this.xp = xp;
        this.pocoes = 2; // Máximo de 2 poções por personagem
        this.vitorias = 0;
        this.derrotas = 0; // Contador de derrotas
        this.mortesSequidas = 0; // Contador de mortes seguidas
        this.congelado = false; // Status de congelamento (especiais bloqueados)
        this.escudoAtivo = false; // Status de escudo ativo
        this.turnosEscudo = 0; // Contador de turnos com escudo
    }

    // Determinar nível baseado no XP
    getNivel() {
        switch (true) {
            case (this.xp < 1000):
                return "Ferro";
            case (this.xp >= 1001 && this.xp <= 2000):
                return "Bronze";
            case (this.xp >= 2001 && this.xp <= 5000):
                return "Prata";
            case (this.xp >= 5001 && this.xp <= 6000):
                return "Ouro";
            case (this.xp >= 6001 && this.xp <= 8000):
                return "Platina";
            case (this.xp >= 8001 && this.xp <= 9000):
                return "Ascendente";
            case (this.xp >= 9001 && this.xp <= 10000):
                return "Imortal";
            default:
                return "Radiante";
        }
    }

    // Usar poção de cura
    usarPocao() {
        if (this.pocoes > 0 && this.vidaAtual < this.vidaMaxima) {
            let cura = Math.floor(Math.random() * 30) + 20; // Cura entre 20-50
            this.vidaAtual = Math.min(this.vidaMaxima, this.vidaAtual + cura);
            this.pocoes--;
            console.log(`${this.nome} usou uma poção e recuperou ${cura} de vida! (${this.vidaAtual}/${this.vidaMaxima})`);
            return true;
        }
        return false;
    }

    // Realizar ataque
    atacar(alvo) {
        let dano = this.ataque + Math.floor(Math.random() * 10) - 5; // Variação de -5 a +5
        let critico = Math.random() < 0.15; // 15% chance de crítico
        let bloqueou = Math.random() < 0.2; // 20% chance do alvo bloquear

        if (critico) {
            dano = Math.floor(dano * 1.5);
            console.log(`💥 ${this.nome} acerta um GOLPE CRÍTICO!`);
        }

        if (bloqueou) {
            dano = Math.floor(dano * 0.3); // Reduz 70% do dano
            console.log(`🛡️ ${alvo.nome} bloqueou o ataque!`);
        }

        // Aplicar defesa
        dano = Math.max(1, dano - alvo.defesa);
        alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);

        console.log(`⚔️ ${this.nome} ataca ${alvo.nome} causando ${dano} de dano!`);
        this.mostrarBarraVida(alvo);

        return dano;
    }

    // Mostrar barra de vida visual
    mostrarBarraVida(personagem) {
        let porcentagem = (personagem.vidaAtual / personagem.vidaMaxima) * 100;
        let barras = Math.floor(porcentagem / 5); // 20 barras no total
        let barraVida = "❤️".repeat(barras) + "💔".repeat(20 - barras);
        console.log(`${personagem.nome}: [${barraVida}] ${personagem.vidaAtual}/${personagem.vidaMaxima} HP`);
    }

    // Ganhar XP (apenas por vitória)
    ganharXP(quantidade) {
        this.xp += quantidade;
        console.log(`🏆 ${this.nome} ganhou ${quantidade} XP por vencer o round! (Total: ${this.xp})`);
        
        // Verificar se subiu de nível
        let nivelAnterior = this.getNivel();
        if (this.xp >= this.getProximoNivel()) {
            console.log(`🎉 ${this.nome} subiu de nível! Agora é ${this.getNivel()}!`);
        }
    }

    // Registrar derrota
    registrarDerrota() {
        this.derrotas++;
        this.mortesSequidas++;
        
        console.log(`💀 ${this.nome} sofreu uma derrota! (${this.mortesSequidas} mortes seguidas)`);
        
        // Resetar XP após 5 mortes seguidas
        if (this.mortesSequidas >= 5) {
            let xpPerdido = this.xp;
            this.xp = 0;
            this.mortesSequidas = 0; // Resetar contador
            console.log(`💥 ${this.nome} perdeu todo o XP (${xpPerdido}) após 5 mortes seguidas! Volta ao nível Ferro!`);
        }
    }

    // Registrar vitória (reseta contador de mortes seguidas)
    registrarVitoria(xpGanho) {
        this.vitorias++;
        this.mortesSequidas = 0; // Resetar mortes seguidas ao vencer
        this.ganharXP(xpGanho);
        console.log(`🎊 ${this.nome} quebrou a sequência de derrotas! Mortes seguidas resetadas.`);
    }

    // Obter XP necessário para próximo nível
    getProximoNivel() {
        switch (true) {
            case (this.xp < 1000): return 1000;
            case (this.xp < 2000): return 2000;
            case (this.xp < 5000): return 5000;
            case (this.xp < 6000): return 6000;
            case (this.xp < 8000): return 8000;
            case (this.xp < 9000): return 9000;
            case (this.xp < 10000): return 10000;
            default: return 999999; // Nível máximo
        }
    }

    // Verificar se está vivo
    estaVivo() {
        return this.vidaAtual > 0;
    }
}

// Classe específica para Arqueira
class Arqueira extends Personagem {
    constructor(nome) {
        super(nome, "Arqueira", 90, 25, 8, 0); // Começar com 0 XP
        this.precisao = 0.85; // 85% de precisão
        this.fenixDisponivel = true; // Especial disponível por round
        this.flechaPerfuranteDisponivel = true; // Segunda habilidade disponível por round
        this.escudoDisponivel = true; // Terceira habilidade disponível por round
    }

    // Especial: Fênix de Fogo
    fenixDeFogo(alvo) {
        console.log(`🔥🦅 ${this.nome} invoca o FÊNIX DE FOGO! 🦅🔥`);
        console.log(`⚡ Uma ave de fogo surge e voa em direção ao inimigo!`);
        
        let acertou = Math.random() <= this.precisao; // Usa a precisão normal
        
        if (!acertou) {
            console.log(`💨 O Fênix de Fogo passou voando e errou o alvo!`);
            return 0;
        }
        
        let dano = this.ataque * 2 + Math.floor(Math.random() * 15); // Dano base dobrado
        let critico = Math.random() < 0.15; // 15% chance de crítico
        let bloqueou = Math.random() < 0.1; // Reduzida chance de bloquear (10% vs 20%)
        
        if (critico) {
            console.log(`💥🔥 CRÍTICO LETAL! O Fênix explode em chamas devastadoras!`);
            console.log(`☠️ ${alvo.nome} foi completamente incinerado pela ave de fogo!`);
            alvo.vidaAtual = 0; // Mata instantaneamente
            this.mostrarBarraVida(alvo);
            return 9999; // Dano simbólico alto
        }
        
        if (bloqueou) {
            dano = Math.floor(dano * 0.5); // Ainda reduz o dano, mas menos
            console.log(`🛡️🔥 ${alvo.nome} tentou se proteger, mas ainda foi queimado!`);
        }
        
        // Aplicar defesa
        dano = Math.max(15, dano - alvo.defesa); // Dano mínimo maior
        alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
        
        console.log(`🔥 O Fênix de Fogo causa ${dano} de dano flamejante!`);
        this.mostrarBarraVida(alvo);
        
        return dano;
    }

    // Especial: Flecha Perfurante
    flechaPerfurante(alvo) {
        console.log(`🏹💀 ${this.nome} prepara uma FLECHA PERFURANTE! 💀🏹`);
        console.log(`⚡ Uma flecha especial com ponta de aço é carregada!`);
        
        let acertou = Math.random() <= (this.precisao + 0.05); // +5% precisão extra
        
        if (!acertou) {
            console.log(`💨 A Flecha Perfurante desviou do alvo!`);
            return 0;
        }
        
        let dano = this.ataque + 15 + Math.floor(Math.random() * 15); // Dano base + 15-30 extra
        let critico = Math.random() < 0.20; // 20% chance de crítico (maior que normal)
        let bloqueou = Math.random() < 0.05; // Muito difícil de bloquear (5% vs 20%)
        
        if (critico) {
            dano = Math.floor(dano * 1.8); // Crítico mais forte que normal
            console.log(`💥💀 ${this.nome} acerta um CRÍTICO PERFURANTE devastador!`);
        }
        
        if (bloqueou) {
            dano = Math.floor(dano * 0.4); // Ainda causa dano considerável mesmo bloqueando
            console.log(`🛡️💀 ${alvo.nome} tentou bloquear, mas a flecha perfurou parte da defesa!`);
        }
        
        // Aplicar defesa (reduzida devido à perfuração)
        let defesaReduzida = Math.floor(alvo.defesa * 0.5); // Defesa reduzida pela perfuração
        dano = Math.max(12, dano - defesaReduzida); // Dano mínimo alto
        alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
        
        console.log(`💀 A Flecha Perfurante atravessa as defesas causando ${dano} de dano!`);
        this.mostrarBarraVida(alvo);
        
        return dano;
    }

    // Especial: Escudo Élfico
    escudoElfico() {
        console.log(`🛡️✨ ${this.nome} invoca o ESCUDO ÉLFICO! ✨🛡️`);
        console.log(`🌟 Uma barreira mágica luminosa surge ao redor da arqueira!`);
        
        this.escudoAtivo = true;
        this.turnosEscudo = 3; // Dura 3 turnos
        
        // Também recupera um pouco de vida
        let cura = Math.floor(Math.random() * 15) + 10; // Cura entre 10-25
        this.vidaAtual = Math.min(this.vidaMaxima, this.vidaAtual + cura);
        
        console.log(`✨ O escudo élfico reduzirá dano de ataques múltiplos pelos próximos 3 turnos!`);
        console.log(`🌟 ${this.nome} também recuperou ${cura} de vida! (${this.vidaAtual}/${this.vidaMaxima})`);
        
        return 0; // Não causa dano
    }

    // Sobrescrever método atacar para receber menos dano quando com escudo
    receberDano(dano, ataqueMultiplo = false) {
        if (this.escudoAtivo && ataqueMultiplo) {
            // Reduz significativamente dano de ataques múltiplos
            dano = Math.floor(dano * 0.4); // 60% de redução
            console.log(`🛡️✨ O Escudo Élfico absorve parte do ataque! Dano reduzido para ${dano}!`);
        }
        
        this.vidaAtual = Math.max(0, this.vidaAtual - dano);
        return dano;
    }

    atacar(alvo) {
        // Verificar se está congelado
        if (this.congelado) {
            console.log(`🧊 ${this.nome} está congelado e não pode usar especiais com crítico!`);
            // Pode usar escudo quando congelado (não tem crítico)
            if (this.escudoDisponivel && this.vidaAtual < 60 && Math.random() < 0.6) {
                this.escudoDisponivel = false;
                return this.escudoElfico();
            }
            // Ataque normal forçado
            if (Math.random() > this.precisao) {
                console.log(`🏹 ${this.nome} errou a mira!`);
                return 0;
            }
            console.log(`🏹 ${this.nome} dispara uma flecha normal!`);
            return super.atacar(alvo);
        }
        
        // Decidir qual habilidade usar (25% para cada uma)
        let habilidade = Math.random();
        
        // 25% chance de usar Fênix de Fogo se disponível
        if (this.fenixDisponivel && habilidade < 0.25) {
            this.fenixDisponivel = false; // Usa o especial
            return this.fenixDeFogo(alvo);
        }
        
        // 25% chance de usar Flecha Perfurante se disponível
        if (this.flechaPerfuranteDisponivel && habilidade >= 0.25 && habilidade < 0.50) {
            this.flechaPerfuranteDisponivel = false; // Usa o especial
            return this.flechaPerfurante(alvo);
        }
        
        // 25% chance de usar Escudo Élfico se disponível e vida baixa
        if (this.escudoDisponivel && habilidade >= 0.50 && habilidade < 0.75 && this.vidaAtual < 60) {
            this.escudoDisponivel = false; // Usa o especial
            return this.escudoElfico();
        }
        
        // 25% chance de ataque normal (ou se escudo não foi usado)
        if (Math.random() > this.precisao) {
            console.log(`🏹 ${this.nome} errou a mira!`);
            return 0;
        }
        console.log(`🏹 ${this.nome} dispara uma flecha!`);
        return super.atacar(alvo);
    }
}

// Classe específica para Pikeman
class Pikeman extends Personagem {
    constructor(nome) {
        super(nome, "Pikeman", 110, 20, 12, 0); // Começar com 0 XP
        this.alcance = true; // Vantagem de alcance
        this.foiceDisponivel = true; // Especial disponível por round
        this.mestreSombrasDisponivel = true; // Segunda habilidade disponível por round
    }

    // Especial: Foice de Gelo
    foiceDeGelo(alvo) {
        console.log(`❄️🗡️ ${this.nome} invoca a FOICE DE GELO! 🗡️❄️`);
        console.log(`🌨️ Uma aura gélida envolve a lâmina da foice!`);
        
        let dano = this.ataque * 1.5 + Math.floor(Math.random() * 12); // Dano aumentado
        let critico = Math.random() < 0.15; // 15% chance de crítico
        let bloqueou = Math.random() < 0.15; // Reduzida chance de bloquear (15% vs 20%)
        
        if (critico) {
            dano = Math.floor(dano * 1.5);
            console.log(`💥❄️ ${this.nome} acerta um GOLPE CRÍTICO GÉLIDO!`);
        }
        
        if (bloqueou) {
            dano = Math.floor(dano * 0.3);
            console.log(`🛡️ ${alvo.nome} bloqueou parte do ataque!`);
        }
        
        // Aplicar defesa
        dano = Math.max(10, dano - alvo.defesa); // Dano mínimo maior
        alvo.vidaAtual = Math.max(0, alvo.vidaAtual - dano);
        
        console.log(`❄️ A Foice de Gelo causa ${dano} de dano congelante!`);
        
        // Efeito especial: Congelar o inimigo
        alvo.congelado = true;
        console.log(`🧊 ${alvo.nome} foi CONGELADO! Especiais com crítico bloqueados no próximo round!`);
        
        this.mostrarBarraVida(alvo);
        return dano;
    }

    // Especial: Mestre Das Sombras
    mestreDasSombras(alvo) {
        console.log(`🌑👥 ${this.nome} ativa MESTRE DAS SOMBRAS! 👥🌑`);
        console.log(`💨 Múltiplas sombras surgem e se multiplicam em velocidade sobrenatural!`);
        
        let danoTotal = 0;
        let numeroSombras = Math.floor(Math.random() * 3) + 3; // 3-5 sombras
        
        console.log(`⚡ ${numeroSombras} sombras atacam simultaneamente!`);
        
        for (let i = 1; i <= numeroSombras; i++) {
            if (alvo.vidaAtual <= 0) {
                break; // Para se o alvo morrer
            }
            
            let danoSombra = Math.floor(this.ataque * 0.6) + Math.floor(Math.random() * 8); // Dano menor por sombra
            let critico = Math.random() < 0.10; // 10% chance de crítico por sombra
            let bloqueou = Math.random() < 0.08; // Difícil bloquear múltiplos ataques (8%)
            
            if (critico) {
                danoSombra = Math.floor(danoSombra * 1.6);
                console.log(`💥🌑 Sombra ${i} acerta um CRÍTICO SOMBRIO!`);
            }
            
            if (bloqueou) {
                danoSombra = Math.floor(danoSombra * 0.4);
                console.log(`🛡️ ${alvo.nome} bloqueou parcialmente o ataque da sombra ${i}!`);
            }
            
            // Aplicar defesa (reduzida devido à velocidade)
            let defesaReduzida = Math.floor(alvo.defesa * 0.7); // Defesa reduzida por velocidade
            danoSombra = Math.max(3, danoSombra - defesaReduzida); // Dano mínimo por sombra
            
            // Usar método especial de dano se o alvo for Artemis
            if (alvo.receberDano) {
                alvo.receberDano(danoSombra, true); // true indica ataque múltiplo
            } else {
                alvo.vidaAtual = Math.max(0, alvo.vidaAtual - danoSombra);
            }
            
            console.log(`🌑 Sombra ${i} ataca causando ${danoSombra} de dano!`);
            danoTotal += danoSombra;
        }
        
        console.log(`👥 As sombras desaparecem após causar ${danoTotal} de dano total!`);
        this.mostrarBarraVida(alvo);
        
        return danoTotal;
    }

    atacar(alvo) {
        // Decidir qual habilidade usar (33% para cada uma)
        let habilidade = Math.random();
        
        // 33% chance de usar Foice de Gelo se disponível
        if (this.foiceDisponivel && habilidade < 0.33) {
            this.foiceDisponivel = false; // Usa o especial
            return this.foiceDeGelo(alvo);
        }
        
        // 33% chance de usar Mestre das Sombras se disponível
        if (this.mestreSombrasDisponivel && habilidade >= 0.33 && habilidade < 0.66) {
            this.mestreSombrasDisponivel = false; // Usa o especial
            return this.mestreDasSombras(alvo);
        }
        
        // 34% chance de ataque normal
        console.log(`🗡️ ${this.nome} ataca com sua foice!`);
        let dano = super.atacar(alvo);
        
        // Chance de ataque duplo devido ao alcance da foice
        if (Math.random() < 0.15) {
            console.log(`⚡ ${this.nome} realiza um ataque giratório!`);
            dano += super.atacar(alvo);
        }
        
        return dano;
    }
}

// Função para simular uma batalha
function batalha(personagem1, personagem2) {
    console.log(`\n⚔️ === BATALHA ÉPICA === ⚔️`);
    console.log(`${personagem1.nome} (${personagem1.classe}) VS ${personagem2.nome} (${personagem2.classe})`);
    console.log(`═══════════════════════════════════════`);

    let turno = 1;
    
    while (personagem1.estaVivo() && personagem2.estaVivo()) {
        console.log(`\n--- Turno ${turno} ---`);
        
        // Remover congelamento no início do turno (efeito dura 1 turno)
        if (personagem1.congelado) {
            console.log(`🌡️ ${personagem1.nome} não está mais congelado!`);
            personagem1.congelado = false;
        }
        if (personagem2.congelado) {
            console.log(`🌡️ ${personagem2.nome} não está mais congelado!`);
            personagem2.congelado = false;
        }
        
        // Gerenciar escudo da Artemis
        if (personagem1.escudoAtivo) {
            personagem1.turnosEscudo--;
            if (personagem1.turnosEscudo <= 0) {
                personagem1.escudoAtivo = false;
                console.log(`🌟 O Escudo Élfico de ${personagem1.nome} desapareceu!`);
            } else {
                console.log(`✨ ${personagem1.nome} ainda está protegido pelo Escudo Élfico! (${personagem1.turnosEscudo} turnos restantes)`);
            }
        }
        if (personagem2.escudoAtivo) {
            personagem2.turnosEscudo--;
            if (personagem2.turnosEscudo <= 0) {
                personagem2.escudoAtivo = false;
                console.log(`🌟 O Escudo Élfico de ${personagem2.nome} desapareceu!`);
            } else {
                console.log(`✨ ${personagem2.nome} ainda está protegido pelo Escudo Élfico! (${personagem2.turnosEscudo} turnos restantes)`);
            }
        }
        
        // Personagem 1 ataca
        if (personagem1.estaVivo()) {
            // Decidir se usa poção (30% chance quando vida < 40%)
            if (personagem1.vidaAtual < 40 && personagem1.pocoes > 0 && Math.random() < 0.3) {
                personagem1.usarPocao();
            } else {
                personagem1.atacar(personagem2);
            }
        }

        // Personagem 2 ataca (se ainda estiver vivo)
        if (personagem2.estaVivo()) {
            // Decidir se usa poção (30% chance quando vida < 40%)
            if (personagem2.vidaAtual < 40 && personagem2.pocoes > 0 && Math.random() < 0.3) {
                personagem2.usarPocao();
            } else {
                personagem2.atacar(personagem1);
            }
        }

        turno++;
        
        // Evitar batalhas infinitas
        if (turno > 20) {
            console.log("\n⏰ Batalha muito longa! Empate por timeout!");
            return null;
        }
    }

    // Determinar vencedor
    let vencedor = personagem1.estaVivo() ? personagem1 : personagem2;
    let perdedor = personagem1.estaVivo() ? personagem2 : personagem1;
    
    console.log(`\n🏆 ${vencedor.nome} venceu a batalha!`);
    
    // Sistema de XP apenas para vencedor
    let xpGanho = Math.floor(Math.random() * 300) + 200; // 200-500 XP apenas para vencedor
    vencedor.registrarVitoria(xpGanho);
    
    // Perdedor registra derrota (pode perder XP após 5 mortes seguidas)
    perdedor.registrarDerrota();
    
    // Resetar vida para próxima batalha
    personagem1.vidaAtual = personagem1.vidaMaxima;
    personagem2.vidaAtual = personagem2.vidaMaxima;
    
    return vencedor;
}

// Criar personagens
let artemis = new Arqueira("Artemis");
let grimReaper = new Pikeman("Grim Reaper");

console.log("🏹 === SISTEMA DE COMBATE ÉPICO === 🗡️");
console.log("\n📊 Status inicial dos personagens:");
console.log(`${artemis.nome} - ${artemis.classe}`);
console.log(`  ❤️ Vida: ${artemis.vidaMaxima}`);
console.log(`  ⚔️ Ataque: ${artemis.ataque}`);
console.log(`  🛡️ Defesa: ${artemis.defesa}`);
console.log(`  🎯 Precisão: ${artemis.precisao * 100}%`);
console.log(`  🧪 Poções: ${artemis.pocoes}`);
console.log(`  🔥🦅 Especial 1: Fênix de Fogo (crítico letal)`);
console.log(`  🏹💀 Especial 2: Flecha Perfurante (alto dano)`);
console.log(`  🛡️✨ Especial 3: Escudo Élfico (proteção anti-sombras)`);
console.log(`  ⭐ XP: ${artemis.xp} (Nível: ${artemis.getNivel()})`);
console.log(`  💀 Mortes seguidas: ${artemis.mortesSequidas}/5`);

console.log(`\n${grimReaper.nome} - ${grimReaper.classe}`);
console.log(`  ❤️ Vida: ${grimReaper.vidaMaxima}`);
console.log(`  ⚔️ Ataque: ${grimReaper.ataque}`);
console.log(`  🛡️ Defesa: ${grimReaper.defesa}`);
console.log(`  📏 Alcance especial: Sim`);
console.log(`  🧪 Poções: ${grimReaper.pocoes}`);
console.log(`  ❄️🗡️ Especial 1: Foice de Gelo (congelamento)`);
console.log(`  🌑👥 Especial 2: Mestre das Sombras (ataques múltiplos)`);
console.log(`  ⭐ XP: ${grimReaper.xp} (Nível: ${grimReaper.getNivel()})`);
console.log(`  💀 Mortes seguidas: ${grimReaper.mortesSequidas}/5`);

// Realizar 3 rounds de batalha
let resultados = [];
for (let round = 1; round <= 3; round++) {
    console.log(`\n\n🔥 ===== ROUND ${round} ===== 🔥`);
    
    // Resetar poções e especiais para cada round
    artemis.pocoes = 2;
    artemis.fenixDisponivel = true; // Resetar especial da Artemis
    artemis.flechaPerfuranteDisponivel = true; // Resetar segunda habilidade da Artemis
    artemis.escudoDisponivel = true; // Resetar terceira habilidade da Artemis
    artemis.congelado = false; // Remover congelamento
    artemis.escudoAtivo = false; // Remover escudo
    artemis.turnosEscudo = 0; // Resetar contador
    grimReaper.pocoes = 2;
    grimReaper.foiceDisponivel = true; // Resetar especial do Grim Reaper
    grimReaper.mestreSombrasDisponivel = true; // Resetar segunda habilidade do Grim Reaper
    grimReaper.congelado = false; // Remover congelamento
    
    let vencedor = batalha(artemis, grimReaper);
    resultados.push(vencedor);
}

// Estatísticas finais
console.log("\n\n📈 === ESTATÍSTICAS FINAIS === 📈");
console.log("═══════════════════════════════════════");

console.log(`\n🏆 Resultados dos rounds:`);
for (let i = 0; i < resultados.length; i++) {
    if (resultados[i]) {
        console.log(`  Round ${i + 1}: ${resultados[i].nome} venceu!`);
    } else {
        console.log(`  Round ${i + 1}: Empate`);
    }
}

console.log(`\n📊 Placar final:`);
console.log(`  ${artemis.nome}: ${artemis.vitorias} vitórias`);
console.log(`  ${grimReaper.nome}: ${grimReaper.vitorias} vitórias`);

// Determinar campeão
let campeao;
if (artemis.vitorias > grimReaper.vitorias) {
    campeao = artemis;
} else if (grimReaper.vitorias > artemis.vitorias) {
    campeao = grimReaper;
} else {
    campeao = null;
}

if (campeao) {
    console.log(`\n👑 CAMPEÃO GERAL: ${campeao.nome}!`);
} else {
    console.log(`\n🤝 EMPATE GERAL! Ambos os guerreiros são igualmente habilidosos!`);
}

console.log(`\n⭐ XP e Níveis finais:`);
console.log(`  ${artemis.nome}: ${artemis.xp} XP (Nível: ${artemis.getNivel()}) - ${artemis.vitorias}V/${artemis.derrotas}D - Mortes seguidas: ${artemis.mortesSequidas}/5`);
console.log(`  ${grimReaper.nome}: ${grimReaper.xp} XP (Nível: ${grimReaper.getNivel()}) - ${grimReaper.vitorias}V/${grimReaper.derrotas}D - Mortes seguidas: ${grimReaper.mortesSequidas}/5`);

console.log(`\n📊 Sistema de Progressão:`);
console.log(`  🏆 XP ganho apenas por vitórias (200-500 XP por round vencido)`);
console.log(`  💀 Após 5 mortes seguidas: XP resetado para 0 (volta ao Ferro)`);
console.log(`  🎯 Vencer um round reseta o contador de mortes seguidas`);

console.log(`\n🎮 === FIM DO TORNEIO === 🎮`);
