import { SubjectNameValidator } from './subject-name-validator';

describe('SubjectNameValidator', () => {
  it('should create an instance', () => {
    const directive = new SubjectNameValidator();
    expect(directive).toBeTruthy();
  });
});
