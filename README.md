# ⚔️ Sistema de Combate Épico - Desafio DIO

Um sistema de combate épico desenvolvido em JavaScript, apresentando batalhas entre dois personagens únicos com habilidades especiais devastadoras.

## 🎮 Personagens

### 🏹 Artemis - A Arqueira Letal
- **Vida**: 90 HP
- **Ataque**: 25
- **Defesa**: 8
- **Precisão**: 85%
- **Nível Inicial**: Platina (7200 XP)

#### Habilidades Especiais:
- **🔥🦅 Fênix de Fogo**: Invoca uma ave de fogo com chance de crítico letal que mata instantaneamente
- **🏹💀 Flecha Perfurante**: Dispara uma flecha que perfura defesas com alto dano
- **🛡️✨ Escudo Élfico**: Barreira mágica que reduz 60% do dano de ataques múltiplos por 3 turnos

### 🗡️ Grim Reaper - O Ceifador das Almas
- **Vida**: 110 HP
- **Ataque**: 20
- **Defesa**: 12
- **Alcance**: Especial com foice
- **Nível Inicial**: Platina (6800 XP)

#### Habilidades Especiais:
- **❄️🗡️ Foice de Gelo**: Ataque gélido que congela o inimigo, bloqueando especiais com crítico
- **🌑👥 Mestre das Sombras**: Invoca 3-5 sombras que atacam simultaneamente

## 🎯 Mecânicas de Combate

### Sistema de Batalha
- **Turnos alternados** com múltiplas opções de ação
- **Sistema de XP** com progressão de níveis
- **Poções de cura** (2 por round, cura 20-50 HP)
- **Críticos** (15-20% de chance dependendo da habilidade)
- **Bloqueios** (5-20% de chance dependendo do ataque)
- **Efeitos de status** (congelamento, escudo protetor)

### Níveis de Progressão
- **Ferro**: < 1000 XP
- **Bronze**: 1001-2000 XP
- **Prata**: 2001-5000 XP
- **Ouro**: 5001-6000 XP
- **Platina**: 6001-8000 XP
- **Ascendente**: 8001-9000 XP
- **Imortal**: 9001-10000 XP
- **Radiante**: > 10000 XP

## 🏆 Sistema de Torneio

O jogo executa um torneio de **3 rounds**, onde:
- Cada round restaura vida, poções e habilidades especiais
- Personagens ganham XP após cada batalha
- O vencedor é determinado pelo melhor de 3 rounds
- Estatísticas finais são exibidas ao final

## 🚀 Como Executar

```bash
node index.js
```

## 📊 Características Técnicas

- **Linguagem**: JavaScript (ES6+)
- **Paradigma**: Programação Orientada a Objetos
- **Classes**: Sistema de herança com classe base `Personagem`
- **Aleatoriedade**: Sistema robusto de RNG para combate dinâmico
- **Balanceamento**: Mecânicas equilibradas para gameplay justo

## 🎨 Features Visuais

- Barras de vida com emojis (❤️💔)
- Efeitos visuais para habilidades especiais
- Sistema de feedback detalhado do combate
- Interface de terminal colorida e intuitiva

## 🔄 Atualizações

### v2.0 - Sistema Completo
- ✅ Implementação de múltiplas habilidades especiais
- ✅ Sistema de status effects (congelamento, escudo)
- ✅ Balanceamento avançado de combate
- ✅ Sistema de torneio com 3 rounds
- ✅ Mecânicas de defesa e contra-ataques

---

*Desenvolvido como parte do Desafio DIO - Transformando um projeto básico em um sistema de combate épico!*
