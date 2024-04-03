import { Component, OnInit } from "@angular/core";
import { ProjetService } from "app/Services/gestionProjetServices/ProjetServices";
import { data } from "autoprefixer";
import { Projet } from "Models/projet.model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-afficher-projet",
  templateUrl: "./afficher-projet.component.html",
  styleUrls: ["./afficher-projet.component.scss"],
})
export class AfficherProjetComponent implements OnInit {
  projets: Projet[];
  selectedProject = null;
  public contentHeader: object;
  showSucessDelete: boolean = false;
  constructor(
    private projetService: ProjetService,
    private router: Router,
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Bootstrap Tables",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Table",
            isLink: true,
            link: "/",
          },
          {
            name: "Bootstrap Tables",
            isLink: false,
          },
        ],
      },
    };

    this.loadProjets();
  }
  loadProjets(): void {
    this.projetService.getProjets().subscribe(
      (data: Projet[]) => {
        this.projets = data;
        console.log(this.projets);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  updateProjet(idProjet: number, projet: Projet): void {
    this.router.navigate(["/edit-projet", idProjet]);
  }
  deleteProjet(idProjet: number) {
    this.httpClient
      .delete(
        `http://localhost:8081/pokerplanning/Projet/deleteprojet/${idProjet}`
      )
      .subscribe(
        () => {
          // Gérer la suppression réussie
          console.log("Projet supprimé avec succès.");
          this.showSucessDelete = true;
          setTimeout(() => {
            this.showSucessDelete = false;
            this.modalService.dismissAll();
            this.loadProjets();
          }, 2000);

          // Mettre à jour la liste des projets ou toute autre logique nécessaire
        },
        (error: any) => {
          console.error("Erreur lors de la suppression du projet:", error);
        }
      );
  }
  // modal Open Danger
  modalOpenDanger(project, modalDanger) {
    this.selectedProject = project;
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: "modal modal-danger",
    });
  }

  deleteSelectedProjet() {
    this.deleteProjet(this.selectedProject.idProjet);
  }
}
