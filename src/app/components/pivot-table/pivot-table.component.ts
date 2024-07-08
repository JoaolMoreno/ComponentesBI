import { Component, Input, OnInit, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Medida {
  campo: string;
  tipo: 'sum' | 'avg' | 'min' | 'max' | 'count';
  nome: string;
}

@Component({
  selector: 'app-pivot-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PivotTableComponent implements OnInit, OnChanges {
  @Input() dados: any[] = [];
  @Input() linhas: string[] = [];
  @Input() colunas: string[] = [];
  @Input() medidas: Medida[] = [];

  dadosDinamicos: any[] = [];
  colunasUnicas: string[] = [];

  ngOnInit() {
    this.gerarDadosDinamicos();
  }

  ngOnChanges() {
    this.gerarDadosDinamicos();
  }

  gerarDadosDinamicos() {
    const dadosDinamicos: any = {};
    const colunasUnicasSet = new Set<string>();

    this.dados.forEach(item => {
      const chaveLinha = this.linhas.map(linha => item[linha]).join('-');
      const chaveColuna = this.colunas.map(coluna => item[coluna]).join('-');

      colunasUnicasSet.add(chaveColuna);

      if (!dadosDinamicos[chaveLinha]) {
        dadosDinamicos[chaveLinha] = { colunas: {} };
      }

      if (!dadosDinamicos[chaveLinha].colunas[chaveColuna]) {
        dadosDinamicos[chaveLinha].colunas[chaveColuna] = {};
        this.medidas.forEach(medida => {
          dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo] = {
            count: 0,
            sum: 0,
            min: Infinity,
            max: -Infinity,
            avg: 0
          };
        });
      }

      this.medidas.forEach(medida => {
        const valor = item[medida.campo];
        switch (medida.tipo) {
          case 'count':
            dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].count += 1;
            break;
          case 'sum':
            dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].sum += valor;
            break;
          case 'avg':
            dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].sum += valor;
            dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].count += 1;
            break;
          case 'min':
            if (valor < dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].min) {
              dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].min = valor;
            }
            break;
          case 'max':
            if (valor > dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].max) {
              dadosDinamicos[chaveLinha].colunas[chaveColuna][medida.campo].max = valor;
            }
            break;
        }
      });
    });

    this.colunasUnicas = Array.from(colunasUnicasSet);

    // Calcula a média após todos os dados serem agregados
    this.dadosDinamicos = Object.keys(dadosDinamicos).map(chaveLinha => {
      const linha = dadosDinamicos[chaveLinha];
      Object.keys(linha.colunas).forEach(chaveColuna => {
        this.medidas.forEach(medida => {
          if (medida.tipo === 'avg') {
            const dadosCampo = linha.colunas[chaveColuna][medida.campo];
            dadosCampo.avg = dadosCampo.sum / dadosCampo.count;
          }
        });
      });
      return {
        chaveLinha,
        colunas: linha.colunas
      };
    });

    // Garante que todas as combinações de chaveLinha e colunasUnicas estejam presentes
    this.dadosDinamicos.forEach(linha => {
      this.colunasUnicas.forEach(chaveColuna => {
        if (!linha.colunas[chaveColuna]) {
          linha.colunas[chaveColuna] = {};
          this.medidas.forEach(medida => {
            linha.colunas[chaveColuna][medida.campo] = {
              count: 0,
              sum: 0,
              min: 0,
              max: 0,
              avg: 0
            };
          });
        }
      });
    });
  }
}
