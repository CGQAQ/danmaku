import { TestBed } from '@angular/core/testing';

import { PlayService } from './play-service.service';

describe('PlayServiceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: PlayService = TestBed.get(PlayService);
        expect(service).toBeTruthy();
    });
});
