import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';

interface Medida {
  campo: string;
  tipo: 'sum' | 'avg' | 'min' | 'max' | 'count';
  nome: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PivotTableComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  titulo = 'ComponentesBI';
  dados = [
    { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 100, ano: 2022 },
    { categoria: 'Eletrônicos', regiao: 'Sul', vendas: 150, ano: 2022 },
    { categoria: 'Eletrônicos', regiao: 'Leste', vendas: 5, ano: 2022 },
    { categoria: 'Roupas', regiao: 'Norte', vendas: 200, ano: 2022 },
    { categoria: 'Roupas', regiao: 'Sul', vendas: 250, ano: 2022 },
    { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 300, ano: 2023 },
    { categoria: 'Eletrônicos', regiao: 'Sul', vendas: 350, ano: 2023 },
    { categoria: 'Roupas', regiao: 'Norte', vendas: 400, ano: 2023 },
    { categoria: 'Roupas', regiao: 'Sul', vendas: 450, ano: 2023 },
    { categoria: 'Bicicletas', regiao: 'Norte', vendas: 500, ano: 2023 },
    { categoria: 'Bicicletas', regiao: 'Sul', vendas: 50, ano: 2023 },
    { categoria: 'Bicicletas', regiao: 'Leste', vendas: 25, ano: 2023 },
  ];

  categoriasUnicas: string[] = [];
  regioesUnicas: string[] = [];
  dadosFiltrados = this.dados;

  categoriaSelecionada = '';
  regiaoSelecionada = '';

  medidas: Medida[] = [
    { campo: 'vendas', tipo: 'sum', nome: 'Total de Vendas' },
    { campo: 'vendas', tipo: 'avg', nome: 'Média de Vendas' },
    { campo: 'vendas', tipo: 'min', nome: 'Mínimo de Vendas' },
    { campo: 'vendas', tipo: 'max', nome: 'Máximo de Vendas' },
    { campo: 'vendas', tipo: 'count', nome: 'Contagem de Vendas' }
  ];

  dimensoes: string[] = ['categoria', 'regiao', 'ano'];
  linhasSelecionadas: string[] = ['categoria'];
  colunasSelecionadas: string[] = ['ano'];
  medidasSelecionadas: Medida[] = [...this.medidas];

  ngOnInit() {
    this.categoriasUnicas = Array.from(new Set(this.dados.map(item => item.categoria)));
    this.regioesUnicas = Array.from(new Set(this.dados.map(item => item.regiao)));
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.dadosFiltrados = this.dados.filter(item => {
      return (this.categoriaSelecionada === '' || item.categoria === this.categoriaSelecionada) &&
        (this.regiaoSelecionada === '' || item.regiao === this.regiaoSelecionada);
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
