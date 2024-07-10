import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Importa o HttpClientModule
import { Papa } from 'ngx-papaparse';

interface Medida {
  campo: string;
  tipo: 'sum' | 'avg' | 'min' | 'max' | 'count';
  nome: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PivotTableComponent, CommonModule, FormsModule, HttpClientModule], // Adiciona o HttpClientModule aqui
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Papa]
})
export class AppComponent implements OnInit {
  titulo = 'ComponentesBI';
  dados: any[] = [];
  categoriasUnicas: string[] = [];
  regioesUnicas: string[] = [];
  dadosFiltrados = this.dados;

  categoriaSelecionada = '';
  regiaoSelecionada = '';

  medidas: Medida[] = [
    { campo: 'IDCHAPA', tipo: 'count', nome: 'Funcionarios' }
  ];

  dimensoes: string[] = ['REGIAO', 'UNIDADE', 'SECAO', 'EMPRESA', 'NOME', 'SITUACAO','CARGO','FUNCAO'];
  linhasSelecionadas: string[] = ['REGIAO', 'UNIDADE', 'SECAO', 'EMPRESA', 'NOME', 'SITUACAO','CARGO','FUNCAO'];
  colunasSelecionadas: string[] = [];
  medidasSelecionadas: Medida[] = [...this.medidas];

  constructor(private http: HttpClient, private papa: Papa) {}

  ngOnInit() {
    this.loadCSV();
  }

  loadCSV() {
    this.http.get('/Funcionarios.csv', { responseType: 'text' })
      .subscribe(data => {
        this.papa.parse(data, {
          header: true,
          complete: (result) => {
            this.dados = result.data;
            this.categoriasUnicas = Array.from(new Set(this.dados.map(item => item.REGIAO)));
            this.regioesUnicas = Array.from(new Set(this.dados.map(item => item.UNIDADE)));
            this.aplicarFiltros();
          }
        });
      });
  }

  aplicarFiltros() {
    this.dadosFiltrados = this.dados.filter(item => {
      return (this.categoriaSelecionada === '' || item.REGIAO === this.categoriaSelecionada) &&
        (this.regiaoSelecionada === '' || item.UNIDADE === this.regiaoSelecionada);
    });
  }

  onCategoriaChange() {
    this.aplicarFiltros();
  }

  onRegiaoChange() {
    this.aplicarFiltros();
  }

  toggleDimensao(dimensao: string, tipo: 'linha' | 'coluna') {
    if (tipo === 'linha') {
      if (this.linhasSelecionadas.includes(dimensao)) {
        this.linhasSelecionadas = this.linhasSelecionadas.filter(d => d !== dimensao);
      } else {
        this.linhasSelecionadas.push(dimensao);
      }
      this.linhasSelecionadas = [...this.linhasSelecionadas]; // Forçar a detecção de mudanças
    } else if (tipo === 'coluna') {
      if (this.colunasSelecionadas.includes(dimensao)) {
        this.colunasSelecionadas = this.colunasSelecionadas.filter(d => d !== dimensao);
      } else {
        this.colunasSelecionadas.push(dimensao);
      }
      this.colunasSelecionadas = [...this.colunasSelecionadas]; // Forçar a detecção de mudanças
    }
  }

  toggleMedida(medida: Medida) {
    const index = this.medidasSelecionadas.findIndex(m => m.campo === medida.campo && m.tipo === medida.tipo);
    if (index !== -1) {
      this.medidasSelecionadas.splice(index, 1);
    } else {
      this.medidasSelecionadas.push(medida);
    }
    this.medidasSelecionadas = [...this.medidasSelecionadas]; // Forçar a detecção de mudanças
  }
}
