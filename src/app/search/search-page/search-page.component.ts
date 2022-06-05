import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, Observable, Subscription, map, debounceTime, distinctUntilChanged} from 'rxjs';
import { GifService } from 'src/app/core/service/gif.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit, AfterViewInit{

  gifs: any[] = [];
  page: number = 1;
  totalCount!: number;
  itemsPerPage: number = 20;
  offset: number = 0;
  isLoading = true;

  searchInput: FormControl = new FormControl();


  constructor(private gifService: GifService) { }

  ngOnInit(): void {
    this.renderTrendingGifs();
  }

  renderTrendingGifs(){
    this.gifService.getTrendingGifs()
    .subscribe((response) => {
      this.isLoading = false;
      this.gifs = response.data;
      // this.totalCount = response.pagination.total_count;
      this.setCorrectTotalCount('');

      console.log(response);
    });
  }

  ngAfterViewInit(): void {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        
      )
      .subscribe(query => {
        this.isLoading = true;
        this.page = 1;
        this.offset = 0;
        console.log(query);
        if(query !== ''){
          this.gifService.searchGifs(query, 0)
          .subscribe(response => {
            this.isLoading = false;
            console.log(response);
            this.totalCount = response.pagination.total_count;
            
            console.log('total count is '+ this.totalCount);
            this.gifs = response.data;
          })
        }else{
          this.renderTrendingGifs();
        }
      });
  }

  onPageChange($event: any){
    this.isLoading = true;
    this.page = $event;
    console.log(this.page);
    this.offset = (this.page - 1)*this.itemsPerPage;
    this.gifService.searchGifs(this.searchInput.value, this.offset)
      .subscribe(response => {
        this.isLoading = false;
        console.log(response);
        // this.totalCount = response.pagination.total_count;
        console.log('total count is '+ this.totalCount);
        this.gifs = response.data;
      });
  }

  /*
  GIPHY's API has a little error when giving the total amount of gifs when searching
  for the trending gifs, which leads my pagination to change 
  the number of the final page. When making requests to their API,
  the responses give different total_amount values. 
  Example: A request with offset of 0 or 50 (page 1 and 2 )returns a response that the total_amount is 4044
  but a request with offset from 1000 to the final offset return 2641, which is the correct total_amount.
  Therefore I am forced to make a request with
  an offset somewhere after the first few pages so that I get the actual total_amount and so that
  my paginator displays it rightly.
*/

setCorrectTotalCount(input: string): void{
  this.gifService.searchGifs(input, 3000)
    .subscribe((response) => this.totalCount = response.pagination.total_count);
}
}
