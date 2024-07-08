import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Medida {
  campo: string;
  tipo: 'sum' | 'avg' | 'min' | 'max' | 'count';
  nome: string;
}

interface DadosMedida {
  value: number; // Valor agregado para a medida
  count?: number; // Contagem para cálculo de médias
}

interface ColunaResultados {
  [medidaNome: string]: DadosMedida; // Medidas como propriedades
}

interface LinhaResultados {
  chaveLinha: string;
  colunas: { [chaveColuna: string]: ColunaResultados }; // Ajuste para incluir chaveColuna
}

@Component({
  selector: 'app-pivot-table',
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PivotTableComponent implements OnInit, OnChanges {
  @Input() dados: any[] = [];
  @Input() linhas: string[] = [];
  @Input() colunas: string[] = [];
  @Input() medidas: Medida[] = [];

  dadosDinamicos: LinhaResultados[] = [];
  valoresColunas: string[] = []; // Armazena os valores únicos das colunas

  ngOnInit() {
    this.gerarDadosDinamicos();
    this.valoresColunas = this.getValoresColunas(); // Obtenha os valores únicos das colunas
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dados'] || changes['linhas'] || changes['colunas'] || changes['medidas']) {
      this.gerarDadosDinamicos();
      this.valoresColunas = this.getValoresColunas();
    }
  }

  gerarDadosDinamicos() {
    const resultado: { [key: string]: { [key: string]: ColunaResultados } } = {};

    this.dados.forEach(item => {
      const chaveLinha = this.linhas.map(linha => item[linha]).join(' | ');
      const chaveColuna = this.colunas.map(coluna => item[coluna]).join(' | ');

      this.medidas.forEach(medida => {
        if (!resultado[chaveLinha]) {
          resultado[chaveLinha] = {};
        }

        if (!resultado[chaveLinha][chaveColuna]) {
          resultado[chaveLinha][chaveColuna] = {};
        }

        const medidaKey = medida.nome;
        const valor = item[medida.campo];
        const dadosMedida = resultado[chaveLinha][chaveColuna][medidaKey] || (resultado[chaveLinha][chaveColuna][medidaKey] = { value: 0, count: 0 });

        switch (medida.tipo) {
          case 'sum':
            dadosMedida.value += valor;
            break;
          case 'avg':
            dadosMedida.value += valor;
            dadosMedida.count!++;
            break;
          case 'min':
            dadosMedida.value = dadosMedida.value ? Math.min(dadosMedida.value, valor) : valor;
            break;
          case 'max':
            dadosMedida.value = Math.max(dadosMedida.value, valor);
            break;
          case 'count':
            dadosMedida.value++;
            break;
        }
      });
    });

    this.dadosDinamicos = Object.keys(resultado).map(chaveLinha => {
      const colunas = resultado[chaveLinha];

      // Adicionar colunas vazias para valores de colunas ausentes
      this.valoresColunas.forEach(valorColuna => {
        if (!colunas[valorColuna]) {
          colunas[valorColuna] = {};
          this.medidas.forEach(medida => {
            colunas[valorColuna][medida.nome] = { value: 0, count: 0 };
          });
        }
      });

      return {
        chaveLinha,
        colunas
      };
    });
  }

  getColunas(dado: LinhaResultados): string[] {
    return Object.keys(dado.colunas);
  }

  getValoresColunas(): string[] {
    const valores: Set<string> = new Set();

    this.dados.forEach(item => {
      const valorColuna = this.colunas.map(coluna => item[coluna]).join(' | ');
      valores.add(valorColuna);
    });

    return Array.from(valores);
  }

  getMedidaValor(dado: LinhaResultados, valorColuna: string, medida: Medida): number {
    const coluna = dado.colunas[valorColuna];
    if (!coluna) {
      return 0;
    }
    const dadosMedida = coluna[medida.nome];
    if (!dadosMedida) {
      return 0;
    }
    if (medida.tipo === 'avg') {
      return dadosMedida.count! > 0 ? dadosMedida.value / dadosMedida.count! : 0;
    }
    return dadosMedida.value;
  }
}
