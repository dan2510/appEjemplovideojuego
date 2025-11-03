import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AgChartOptions } from 'ag-charts-community';
import { ReporteBaseModel } from '../../share/models/ReporteBaseModel';
import { ReporteService } from '../../share/services/api/reporte.service';

@Component({
  selector: 'app-reporte-generos',
  standalone: false,
  templateUrl: './reporte-generos.html',
  styleUrl: './reporte-generos.css',
})
export class ReporteGeneros {
  destroy$: Subject<boolean> = new Subject<boolean>();

  // Gráfico de Videojuegos por Géneros
  public chartOptionsGeneros: AgChartOptions | null = null;

  // Datos y opciones para los gráficos de Órdenes
  public dataOrdenes: ReporteBaseModel[] = [];
  public chartOptionsPieMes: AgChartOptions | null = null;
  public chartOptionsLineMes: AgChartOptions | null = null;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.listaVideojuegosByGenero();
    this.listaOrdenes();
  }

  // Lógica para el gráfico de Géneros
  listaVideojuegosByGenero(): void {
    this.reporteService
      .getVideojuegosbyGenero()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: ReporteBaseModel[]) => {
        console.log('Datos de Géneros recibidos:', respuesta);

        if (respuesta && respuesta.length > 0) {
          this.chartOptionsGeneros = {  
            minWidth: 500, 
            title: { text: 'Cantidad de Videojuegos por Género' },
            subtitle: { text: 'Distribución por género' },
            data: respuesta,
            series: [
              {
                type: 'bar',
                xKey: 'name',
                yKey: 'value',
                yName: 'Cantidad',
                shadow: {
                  enabled: true,
                  xOffset: 3,
                  yOffset: 3,
                  blur: 5,
                  color: 'rgba(0,0,0,0.5)',
                },
              },
            ],
            axes: [
              {
                type: 'category',
                position: 'bottom',
                title: { text: 'Género' },
              },
              {
                type: 'number',
                position: 'left',
                title: { text: 'Cantidad de Videojuegos' },
              },
            ],
            background: { fill: '#f0f2f5' },
            legend: { position: 'right' },
          };
        } else {
          this.chartOptionsGeneros = null;
        }
      });
  }

  // Lógica para los gráficos de Órdenes por Mes (Barras y Líneas)
  listaOrdenes(): void {
    this.reporteService
      .getVideojuegosbyMes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: ReporteBaseModel[]) => {
        console.log('Datos de Órdenes por Mes recibidos:', respuesta);
        // Convertir value a number para todos los gráficos
        this.dataOrdenes = respuesta.map((item) => ({
          name: item.name,
          value:
            typeof item.value === 'string'
              ? parseFloat(item.value)
              : item.value,
        }));

        if (this.dataOrdenes && this.dataOrdenes.length > 0) {
          this.chartOptionsPieMes = this.configurarPieOptions(this.dataOrdenes);
          this.chartOptionsLineMes = this.configureLineOptions(
            this.dataOrdenes
          );
        } else {
          this.chartOptionsPieMes = null;
          this.chartOptionsLineMes = null;
        }
      });
  }

  // Configuración para el gráfico de barras por mes (AG Charts)
  configurarPieOptions(data: ReporteBaseModel[]): AgChartOptions {
    return {
      minWidth: 500, 
      title: {
        text: 'Videojuegos Vendidos por Mes',
      },
      subtitle: {
        text: 'Proporción de ventas por mes',
      },
      data: data,
      series: [
        {
          type: 'pie',
          angleKey: 'value',
          legendItemKey: 'name',
          calloutLabelKey: 'name',
          sectorLabel: {
            color: 'white',
            fontWeight: 'bold',
            formatter: ({ datum, angleKey }) => {
              // datum es el objeto de datos actual (ej. {name: '2024-09', value: 4})
              // angleKey es 'value'
              // Puedes calcular el porcentaje o simplemente mostrar el valor
              const total = data.reduce((sum, item) => sum + item.value, 0);
              const percentage =
                total > 0 ? ((datum[angleKey] / total) * 100).toFixed(1) : 0;
              return `${datum.name}: ${datum.value} (${percentage}%)`; // Muestra Mes: Cantidad (Porcentaje%)
            },
          },
          outerRadiusRatio: 0.8, // Para hacer un gráfico de 'doughnut' (anillo)
          // innerRadiusRatio: 0.5, // Agujero sea más grande
        },
      ],
      background: { fill: '#f0f2f5' }, // Un color de fondo diferente
      legend: { position: 'right' }, // La leyenda a la derecha
    };
  }

  // Configuración para el gráfico de líneas por mes (AG Charts)
  configureLineOptions(data: ReporteBaseModel[]): AgChartOptions {
    return {  
      minWidth: 500, 
      title: {
        text: 'Videojuegos Vendidos por Mes',
      },
      subtitle: {
        text: 'Proporción de ventas por mes',
      },
      data: data,
      series: [
        {
          type: 'line',
          xKey: 'name', // 'name' es el mes
          yKey: 'value', // 'value' es la cantidad
          yName: 'Cantidad Vendida',

          marker: {
            // Marcadores en los puntos de la línea
            enabled: true,
            shape: 'circle',
            size: 8,
          },
          strokeWidth: 3,
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: { text: 'Mes' },
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'Cantidad de Videojuegos Vendidos' },
        },
      ],
      background: { fill: '#f0f2f5' },
      legend: { position: 'top' },
      
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
