import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/services/livro.service';

const pausa = 2000;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = "";
  livrosResultado: LivrosResultado;


  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(pausa),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro)
      return of()
    })
  )

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(pausa),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap(() => console.log('Fluxo inicial')),
    map(resultado => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError(erro => {
      console.log(erro)
      return throwError(() => new Error(this.mensagemErro = 'Ocorrou um erro.'))
    })
  )


  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}