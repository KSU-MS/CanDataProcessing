import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.sass"],
})
export class SideNavComponent implements OnInit {
  public logRoutes = [
    { title: "Run Manager", icon: "list", route: "runs" },
    { title: "Upload Manager", icon: "upload", route: "uploads" },
  ];
  constructor() {}

  ngOnInit(): void {}
  isAuthenticated() {
    return true;
  }
}
