import { HttpConfigService } from "./../services/http-config.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styles: [``],
})
export class Tab3Page {
  url: string;
  itemListData = [];
  page_number = 1;
  page_limit = 8;

  constructor(private httpConfigService: HttpConfigService) {}

  ngOnInit() {
    this.getEmployees(false, "");
  }

  getEmployees(isFirstLoad, event) {
    this.url = "?_page=" + this.page_number + "&_limit=" + this.page_limit;

    console.log(event);
    // if (isFirstLoad) return;
    this.httpConfigService.getListItems(this.url).subscribe(
      (data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.itemListData = [...this.itemListData, ...data];
          // this.itemListData.push(data[i]);
        }

        if (isFirstLoad) event.target.complete();

        this.page_number++;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  doInfinite(event) {
    // this.getEmployees(true, event);
  }
}
