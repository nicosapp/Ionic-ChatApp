import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwipePage } from './swipe.page';

describe('SwipePage', () => {
  let component: SwipePage;
  let fixture: ComponentFixture<SwipePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
