import { TestBed, inject } from '@angular/core/testing';

import { WatsonService } from './watson.service';

describe('WatsonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatsonService]
    });
  });

  it('should be created', inject([WatsonService], (service: WatsonService) => {
    expect(service).toBeTruthy();
  }));
});
