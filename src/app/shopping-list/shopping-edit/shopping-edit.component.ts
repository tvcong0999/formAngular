import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  // @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editItem: Ingredient;
  constructor(private slService: ShoppingListService) { }
  @ViewChild('form', { static: false }) slForm: NgForm

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe((index: number) => {
      this.editedItemIndex = index;
      this.editMode = true;
      this.editItem = this.slService.getIndgredients(index);
      this.slForm.setValue({
        name: this.editItem.name,
        amount: this.editItem.amount
      })
    })
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredients(this.editedItemIndex, newIngredient);
    }
    else {
      this.slService.addIngredient(newIngredient);
    }
    form.reset();
    this.editMode = false;
  }

  onClear()
  {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete()
  {
    this.onClear(); 
    this.slService.deleteIngredient(this.editedItemIndex);
  }

}
