import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap}  from 'rxjs/operators'

import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: []
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region:    ['', Validators.required],
    pais:      ['', Validators.required],
    frontera:  ['', Validators.required]
  })

  //LLenar Selecciones
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras : string[] = [];
  fronteras : PaisSmall[] = [];

  //UI
  cargando:boolean = false;
  constructor( private fb: FormBuilder,
               private paisesService: PaisesServiceService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;


    //Cuando cambie la region
    //this.miFormulario.get('region')?.valueChanges
    //  .subscribe(region => {
    //    console.log(region);
    //    this.paisesService.getPaisesPorRegion(region)
    //      .subscribe(paises => {
    //        console.log(paises);
    //        this.paises = paises;
    //        
    //      })
    //  })

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( (_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando =  true;
         // this.miFormulario.get('frontera')?.disable();
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region) )
      )
      .subscribe( paises => {
        this.cargando =  false;
        this.paises = paises;
      })
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap ( ( _ ) => {
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');
            this.cargando =  true;
           //  this.miFormulario.get('frontera')?.disable();
          }),
          switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
          switchMap( pais => this.paisesService.getPaisesPorBorde(pais?.borders!))
        )
        .subscribe(paises =>{
          this.cargando =  false;
          //this.fronteras = pais?.borders || [];
          this.fronteras = paises;
          console.log(paises);
        })
  }
  guardar(){
    console.log(this.miFormulario.value);
  }
}
