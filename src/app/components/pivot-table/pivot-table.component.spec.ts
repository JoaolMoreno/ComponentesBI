import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PivotTableComponent } from './pivot-table.component';
import { CommonModule } from '@angular/common';

describe('PivotTableComponent', () => {
  let component: PivotTableComponent;
  let fixture: ComponentFixture<PivotTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, PivotTableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly with default inputs', () => {
    component.dados = [
      { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 100, ano: 2022 },
      { categoria: 'Roupas', regiao: 'Sul', vendas: 150, ano: 2023 },
    ];
    component.linhas = ['categoria'];
    component.colunas = ['ano'];
    component.medidas = [
      { campo: 'vendas', tipo: 'sum', nome: 'Total de Vendas' }
    ];

    component.ngOnInit();

    expect(component.dadosDinamicos.length).toBe(2);
    expect(component.valoresColunas.length).toBe(2);
  });

  it('should calculate sum correctly', () => {
    component.dados = [
      { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 100, ano: 2022 },
      { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 200, ano: 2022 },
    ];
    component.linhas = ['categoria'];
    component.colunas = ['ano'];
    component.medidas = [
      { campo: 'vendas', tipo: 'sum', nome: 'Total de Vendas' }
    ];

    component.ngOnInit();

    const resultado = component.dadosDinamicos.find(linha => linha.chaveLinha === 'Eletrônicos');
    const colunaResultado = resultado?.colunas['2022'];

    expect(colunaResultado).toBeDefined();
    expect(colunaResultado!['Total de Vendas'].value).toBe(300);
  });

  it('should calculate average correctly', () => {
    component.dados = [
      { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 100, ano: 2022 },
      { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 200, ano: 2022 },
    ];
    component.linhas = ['categoria'];
    component.colunas = ['ano'];
    component.medidas = [
      { campo: 'vendas', tipo: 'avg', nome: 'Média de Vendas' }
    ];

    component.ngOnInit();

    const resultado = component.dadosDinamicos.find(linha => linha.chaveLinha === 'Eletrônicos');
    const colunaResultado = resultado?.colunas['2022'];

    expect(colunaResultado).toBeDefined();
    expect(colunaResultado!['Média de Vendas'].value).toBe(300);
    expect(colunaResultado!['Média de Vendas'].count).toBe(2);
  });

  it('should handle no data gracefully', () => {
    component.dados = [];
    component.linhas = ['categoria'];
    component.colunas = ['ano'];
    component.medidas = [
      { campo: 'vendas', tipo: 'sum', nome: 'Total de Vendas' }
    ];

    component.ngOnInit();

    expect(component.dadosDinamicos.length).toBe(0);
    expect(component.valoresColunas.length).toBe(0);
  });

  it('should update dynamically when inputs change', () => {
    component.dados = [
      { categoria: 'Eletrônicos', regiao: 'Norte', vendas: 100, ano: 2022 },
      { categoria: 'Roupas', regiao: 'Sul', vendas: 150, ano: 2023 },
    ];
    component.linhas = ['categoria'];
    component.colunas = ['ano'];
    component.medidas = [
      { campo: 'vendas', tipo: 'sum', nome: 'Total de Vendas' }
    ];

    component.ngOnInit();

    expect(component.dadosDinamicos.length).toBe(2);

    component.colunas = ['regiao'];
    component.ngOnChanges({
      colunas: {
        currentValue: ['regiao'],
        previousValue: ['ano'],
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.valoresColunas.length).toBe(2);
  });
});
