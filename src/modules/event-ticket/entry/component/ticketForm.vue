<template>
    <div v-if="new_ticket">
        <div>
            <h5 class="publish-title">Create Ticket</h5>
            <span>Choose pricing type you want to sell</span>
            <div class="grid mt-2">
                <div class="field justify-content-start col-12">
                    <Button label="Paid Ticket" class="mt-2"
                        :class="{ 'p-button-primary': isTicketSelected == 'PAID', 'p-button-outlined': isTicketSelected == 'FREE' }"
                        @click="handlePaidTicket" />
                    <Button label="Free Ticket" class="ml-2 mt-2"
                        :class="{ 'p-button-primary': isTicketSelected == 'FREE', 'p-button-outlined': isTicketSelected == 'PAID' }"
                        @click="handleFreeTicket" />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="ticketName">Ticket Name</label>
                    <InputText id="ticketName" v-model="new_ticket.name" placeholder="Enter Ticket Name" class="w-full" />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="entryDate">Entry Date</label>
                    <Calendar id="entryDate" v-model="new_ticket.entry_date" placeholder="Select Entry Date" class="w-full"
                        dateOnly />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="ticketPrice">Ticket Price</label>
                    <InputNumber id="ticketPrice" v-model="new_ticket.price" placeholder="Enter Ticket Price" class="w-full"
                        :disabled="isTicketSelected == 'FREE'" />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="ticketQuantity">Available Quantity ( Your Free ticket: 25 Ticket )</label>
                    <InputText id="ticketQuantity" v-model="new_ticket.initial_quantity" placeholder="Enter Ticket Quantity"
                        class="w-full" />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="saleStart">Sale Start</label>
                    <Calendar id="saleStart" v-model="new_ticket.sale_start_at" placeholder="Start Date & Time"
                        class="w-full" showTime />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="saleEnd">Sale End</label>
                    <Calendar id="saleEnd" v-model="new_ticket.sale_end_at" placeholder="End Date & Time" class="w-full"
                        showTime />
                </div>
                <div class="field col-12 md:col-12 lg:col-12">
                    <label for="description">Description ( Optional )</label>
                    <Textarea id="description" v-model="new_ticket.description"
                        placeholder="Write a little bit about this ticket" class="w-full" rows="4" />
                </div>
            </div>
        </div>
        <div v-if="isTicketSelected == 'PAID'">
            <!-- Early Bird Tickets -->
            <h5><span class="publish-title">Early Bird Tickets</span> (Optional)</h5>
            <div class="grid mt-2">
                <div class="field col-12 md:col-12 lg:col-12">
                    <label for="earlyPrice">Early Bird Ticket Price</label>
                    <InputText id="earlyPrice" v-model="new_ticket.early_price"
                        placeholder="Enter the price of Early Bird ticket " class="w-full" />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="earlyStart">Early Bird Starts</label>
                    <Calendar id="earlyStart" v-model="new_ticket.early_start_at" placeholder="Start Date & Time"
                        class="w-full" showTime />
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                    <label for="earlyEnd">Early Bird Ends</label>
                    <Calendar id="earlyEnd" v-model="new_ticket.early_end_at" placeholder="End Date & Time" class="w-full"
                        showTime />
                </div>
            </div>
        </div>
        <!-- Ticket Visibility -->
        <div class="grid">
            <div class="field col-12 md:col-12 lg:col-12 ml-0">
                <label>Ticket Visibility</label>
                <div class="flex">
                    <div v-for="status in ticket_visibilities" :key="status.code" class="flex align-items-center">
                        <RadioButton v-model="new_ticket.ticket_visibility" :inputId="status.code" name="status"
                            :value="status.name" />
                        <label :for="status.code" class="mx-2">{{ status.name }}</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-content-end mt-3">
            <Button label="Cancel" class="ml-2 mt-2 p-button-primary" @click="cancelForm" />
            <Button label="Draft Save" class="ml-2 mt-2 p-button-primary" @click="submitForm" />
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import useEdit from '../useEdit'
import { ref, defineProps, defineEmits } from 'vue';

const {
    ticket_visibilities,
    isTicketSelected,
    handleFreeTicket,
    handlePaidTicket,
} = useEdit()

const emits = defineEmits(['submit-form', 'cancel-form']);
const props = defineProps(['showTicketFormProp', 'showTicketListProp', 'newTicketData', 'isEditMode', 'eventId']);
const showTicketForm = ref(props.showTicketFormProp !== undefined ? props.showTicketFormProp : true);
const showTicketList = ref(props.showTicketListProp !== undefined ? props.showTicketListProp : false);

const new_ticket = ref({
    id: props.isEditMode ? props.newTicketData[0].id : Date.now(),
    name: props.isEditMode ? props.newTicketData[0].name : "",
    entry_date: props.isEditMode ? props.newTicketData[0].entry_date : "",
    event_id: props.isEditMode ? props.newTicketData[0].event_id : props.eventId,
    price: props.isEditMode ? props.newTicketData[0].price : null,
    ticket_types: props.isEditMode ? props.newTicketData[0].ticket_types : isTicketSelected.value,
    initial_quantity: props.isEditMode ? props.newTicketData[0].initial_quantity : null,
    remaining_quantity: props.isEditMode ? props.newTicketData[0].remaining_quantity : null,
    sale_start_at: props.isEditMode ? props.newTicketData[0].sale_start_at : "",
    sale_end_at: props.isEditMode ? props.newTicketData[0].sale_end_at : "",
    description: props.isEditMode ? props.newTicketData[0].description : "",
    early_price: props.isEditMode ? props.newTicketData[0].early_price : null,
    early_start_at: props.isEditMode ? props.newTicketData[0].early_start_at : "",
    early_end_at: props.isEditMode ? props.newTicketData[0].early_end_at : "",
    ticket_visibility: props.isEditMode ? props.newTicketData[0].ticket_visibility : "SHOW",
    is_deleted: props.isEditMode ? props.newTicketData[0].is_deleted : false,
});

const submitForm = () => {
    const formData = new_ticket.value;
    emits('submit-form', formData);
    showTicketForm.value = false;
    showTicketList.value = true;
};

const cancelForm = () => {
    showTicketForm.value = false;
    showTicketList.value = true;
    emits('cancel-form');
}
</script>