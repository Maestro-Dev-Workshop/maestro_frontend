import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpBaseService } from '../http-base.service';
import { environment } from '../../../../environments/environment';

describe('HttpBaseService', () => {
  let service: HttpBaseService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpBaseService],
    });

    service = TestBed.inject(HttpBaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('get', () => {
    it('should make GET request to correct URL', () => {
      const mockData = { message: 'Success' };

      service.get('test-endpoint').subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${apiUrl}/test-endpoint`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle nested endpoints', () => {
      const mockData = { items: [] };

      service.get('api/v1/items').subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${apiUrl}/api/v1/items`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('post', () => {
    it('should make POST request with body', () => {
      const mockBody = { name: 'Test' };
      const mockResponse = { id: '123', name: 'Test' };

      service.post('test-endpoint', mockBody).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/test-endpoint`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });

    it('should handle empty body', () => {
      const mockResponse = { message: 'Created' };

      service.post('test-endpoint', {}).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/test-endpoint`);
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });

    it('should handle FormData body', () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.txt');
      const mockResponse = { uploaded: true };

      service.post('upload', formData).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeInstanceOf(FormData);
      req.flush(mockResponse);
    });
  });

  describe('put', () => {
    it('should make PUT request with body', () => {
      const mockBody = { name: 'Updated' };
      const mockResponse = { id: '123', name: 'Updated' };

      service.put('test-endpoint/123', mockBody).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/test-endpoint/123`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockBody);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should make DELETE request', () => {
      const mockResponse = { message: 'Deleted' };

      service.delete('test-endpoint/123').subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/test-endpoint/123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should propagate HTTP errors', () => {
      let error: any;

      service.get('error-endpoint').subscribe({
        error: (e) => (error = e),
      });

      const req = httpMock.expectOne(`${apiUrl}/error-endpoint`);
      req.flush({ message: 'Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(error.status).toBe(500);
    });

    it('should handle 404 errors', () => {
      let error: any;

      service.get('not-found').subscribe({
        error: (e) => (error = e),
      });

      const req = httpMock.expectOne(`${apiUrl}/not-found`);
      req.flush({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' });

      expect(error.status).toBe(404);
    });

    it('should handle 401 unauthorized errors', () => {
      let error: any;

      service.get('protected').subscribe({
        error: (e) => (error = e),
      });

      const req = httpMock.expectOne(`${apiUrl}/protected`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(error.status).toBe(401);
    });
  });
});
