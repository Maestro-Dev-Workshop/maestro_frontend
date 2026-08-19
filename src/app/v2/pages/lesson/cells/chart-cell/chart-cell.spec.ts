import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartCell } from './chart-cell';

describe('ChartCell', () => {
  let component: ChartCell;
  let fixture: ComponentFixture<ChartCell>;

  const mockChartData = {
    type: 'chart',
    content: 'This chart shows sales data over time.',
    metadata: {
      graph_content: {
        data: [
          {
            x: ['Jan', 'Feb', 'Mar', 'Apr'],
            y: [10, 15, 13, 17],
            type: 'scatter',
          },
        ],
        layout: {
          title: 'Monthly Sales',
          xaxis: { title: 'Month' },
          yaxis: { title: 'Sales' },
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCell],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartCell);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty context', () => {
      expect(component.context).toBe('');
    });

    it('should accept data input', () => {
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();

      expect(component.data()).toEqual(mockChartData);
    });
  });

  describe('Chart Rendering', () => {
    it('should set context from data content', () => {
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();

      expect(component.context).toBe('This chart shows sales data over time.');
    });

    it('should have plotContainer reference', () => {
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();

      expect(component.plotContainer).toBeDefined();
    });
  });

  describe('Different Chart Types', () => {
    it('should handle bar chart data', () => {
      const barChartData = {
        ...mockChartData,
        metadata: {
          graph_content: {
            data: [{ x: ['A', 'B', 'C'], y: [1, 2, 3], type: 'bar' }],
            layout: { title: 'Bar Chart' },
          },
        },
      };

      fixture.componentRef.setInput('data', barChartData);
      fixture.detectChanges();

      expect(component.data().metadata.graph_content.data[0].type).toBe('bar');
    });

    it('should handle pie chart data', () => {
      const pieChartData = {
        ...mockChartData,
        metadata: {
          graph_content: {
            data: [{ values: [30, 40, 30], labels: ['A', 'B', 'C'], type: 'pie' }],
            layout: { title: 'Pie Chart' },
          },
        },
      };

      fixture.componentRef.setInput('data', pieChartData);
      fixture.detectChanges();

      expect(component.data().metadata.graph_content.data[0].type).toBe('pie');
    });

    it('should handle line chart data', () => {
      const lineChartData = {
        ...mockChartData,
        metadata: {
          graph_content: {
            data: [{ x: [1, 2, 3], y: [4, 5, 6], mode: 'lines', type: 'scatter' }],
            layout: { title: 'Line Chart' },
          },
        },
      };

      fixture.componentRef.setInput('data', lineChartData);
      fixture.detectChanges();

      expect(component.data().metadata.graph_content.data[0].mode).toBe('lines');
    });
  });

  describe('Data Updates', () => {
    it('should update context when data changes', () => {
      fixture.componentRef.setInput('data', mockChartData);
      fixture.detectChanges();

      const newChartData = {
        ...mockChartData,
        content: 'Updated chart context',
      };

      fixture.componentRef.setInput('data', newChartData);
      fixture.detectChanges();

      expect(component.context).toBe('Updated chart context');
    });
  });
});
