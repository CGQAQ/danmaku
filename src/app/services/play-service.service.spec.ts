import { TestBed } from '@angular/core/testing';

import { PlayServiceService } from './play-service.service';

describe('PlayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayServiceService = TestBed.get(PlayServiceService);
    expect(service).toBeTruthy();
  });
});
