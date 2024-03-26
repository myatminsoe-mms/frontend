<template>
  <div>
    <TabView ref="tabViewRef" :activeIndex="activeTabIndex" class="custom-tab-view">
      <div class="p-1">
        <!-- Event Details -->
        <TabPanel :header="panels[0].header">
          <div>
            <form class="p-fluid" @submit.prevent="handleSubmit(!v$.$invalid)">
              <h5>Basic Info</h5>
              <span>Please fill the basic info of your event</span>
              <div class="grid mt-2">
                <div class="field col-12 md:col-12 lg:col-12">
                  <label for="title" :class="{ 'p-error': v$.title.$invalid && submitted }">Title<span
                      class="p-error">*</span></label>
                  <InputText v-model="v$.title.$model" id="title" placeholder="Enter the title of your event"
                    :class="{ 'p-invalid': v$.title.$invalid && submitted }" />
                  <small v-if="(v$.title.$invalid && submitted) || v$.title.$pending.$response" class="p-error">{{
                    v$.title.required.$message.replace('Value', 'title') }}</small>
                  <!-- Server Validation -->
                  <small v-if="errors.has('title')" class="p-error">
                    <div v-for="error in errors.get('title')" :key="error">
                      {{ error }}
                    </div>
                  </small>
                  <!-- Server Validation -->
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="type" :class="{ 'p-error': v$.type_id.$invalid && submitted }">Type <span
                      class="p-error">*</span></label>
                  <Dropdown v-model="v$.type_id.$model" :options="types" :filter="true" optionLabel="name"
                    optionValue="id" placeholder="Select your event type" class="w-full" :showClear="true"
                    :class="{ 'p-invalid': v$.type_id.$invalid && submitted }" />
                  <small v-if="(v$.type_id.$invalid && submitted) || v$.type_id.$pending.$response" class="p-error">
                    {{ v$.type_id.required.$message.replace('Value', 'Event type') }}
                  </small>
                </div>

                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="category" :class="{ 'p-error': v$.category_id.$invalid && submitted }">Category <span
                      class="p-error">*</span></label>
                  <Dropdown v-model="v$.category_id.$model" :options="categories" :filter="true" optionLabel="name"
                    optionValue="id" placeholder="Select your event category" class="w-full" :showClear="true"
                    :class="{ 'p-invalid': v$.category_id.$invalid && submitted }" />
                  <small v-if="(v$.category_id.$invalid && submitted) || v$.category_id.$pending.$response"
                    class="p-error">
                    {{ v$.category_id.required.$message.replace('Value', 'Event category') }}
                  </small>
                </div>

                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="organizer" :class="{ 'p-error': v$.organizer_id.$invalid && submitted }">Organizers <span
                      class="p-error">*</span></label>
                  <Dropdown v-model="v$.organizer_id.$model" :options="organizers" :filter="true" optionLabel="name"
                    optionValue="id" placeholder="Select your event organizer" class="w-full" :showClear="true"
                    :class="{ 'p-invalid': v$.organizer_id.$invalid && submitted }" />
                  <small v-if="(v$.organizer_id.$invalid && submitted) || v$.organizer_id.$pending.$response"
                    class="p-error">
                    {{ v$.organizer_id.required.$message.replace('Value', 'Event organizer') }}
                  </small>
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="tags" :class="{ 'p-error': v$.tags.$invalid && submitted }">Tags <span
                      class="p-error">*</span></label>
                  <MultiSelect v-model="v$.tags.$model" display="chip" filter :options="tags" optionLabel="name"
                    optionValue="name" placeholder="Select Tags" :maxSelectedLabels="5" class="w-full"
                    :class="{ 'p-invalid': v$.tags.$invalid && submitted }" />
                  <small v-if="(v$.tags.$invalid && submitted) || v$.tags.$pending.$response" class="p-error">
                    {{ v$.tags.required.$message.replace('Value', 'Event tag') }}
                  </small>
                </div>
                <div class="field col-12 md:col-12 lg:col-12">
                  <label for="about" :class="{ 'p-error': v$.about.$invalid && submitted }">About the event <span
                      class="p-error">*</span></label>
                  <Textarea id="about" v-model="v$.about.$model" rows="4" placeholder="Tell us about our event"
                    :class="{ 'p-invalid': v$.about.$invalid && submitted }"></Textarea>
                  <small v-if="(v$.about.$invalid && submitted) || v$.about.$pending.$response" class="p-error">
                    {{ v$.about.required.$message.replace('Value', 'About the event') }}
                  </small>
                </div>
              </div>

              <!-- Template -->
              <h5>Template <span class="p-error">*</span></h5>
              <span>Let's choose a design template for your event website</span>
              <div class="card-container mt-3">
                <Card v-for="(template, index) in templates" :key="index"
                  :class="{ 'selected-card': selectedTemplateIndex === index }" @click="selectedTemplate(index)">
                  <template #header>
                    <img :src="template.image" alt="Card Image" class="card-image" />
                    <span class="card-tag btn">{{ template.tag }}</span>
                  </template>
                  <template #title> {{ template.title }} </template>
                </Card>
              </div>

              <!-- Location -->
              <h5>Location</h5>
              <span>Please fill the location of your event where will you held</span>
              <div class="grid mt-2">
                <div class="field col-12 md:col-12 lg:col-12">
                  <label for="location">Select your Event Location</label>
                  <div class="flex justify-content-start">
                    <div>
                      <Button label="Venue" class="mt-2"
                        :class="{ 'p-button-primary': isLocationSelected == 'VENUE', 'p-button-outlined': isLocationSelected == 'ONLINE' }"
                        @click="handleVenue" />
                    </div>
                    <div>
                      <Button label="Online Event" class="ml-2 mt-2"
                        :class="{ 'p-button-primary': isLocationSelected == 'ONLINE', 'p-button-outlined': isLocationSelected == 'VENUE' }"
                        @click="handleOnlineEvent" />
                    </div>
                  </div>
                </div>
                <div class="field col-12 md:col-12 lg:col-12" v-if="isLocationSelected == 'VENUE'">
                  <label for="venueAddress" :class="{ 'p-error': v$.venue_address.$invalid && submitted }">Address<span
                      class="p-error">*</span></label>
                  <InputText v-model="v$.venue_address.$model" id="venueAddress" placeholder="Enter your venue address"
                    :class="{ 'p-invalid': v$.venue_address.$invalid && submitted }" />
                  <small v-if="(v$.venue_address.$invalid && submitted) || v$.venue_address.$pending.$response"
                    class="p-error">
                    {{ v$.venue_address.required.$message.replace('Value', 'Venue Address') }}
                  </small>
                </div>
                <div class="field col-12 md:col-12 lg:col-12" v-if="isLocationSelected == 'ONLINE'">
                  <label for="onlineAddress" :class="{ 'p-error': v$.online_address.$invalid && submitted }">Address<span
                      class="p-error">*</span></label>
                  <InputText v-model="v$.online_address.$model" id="onlineAddress" placeholder="Enter your online address"
                    :class="{ 'p-invalid': v$.online_address.$invalid && submitted }" />
                  <small v-if="(v$.online_address.$invalid && submitted) || v$.online_address.$pending.$response"
                    class="p-error">
                    {{ v$.online_address.required.$message.replace('Value', 'Online Address') }}
                  </small>
                </div>
                <div class="field col-12 md:col-12 lg:col-12" v-if="isLocationSelected == 'VENUE'">
                  <label for="mapURL" :class="{ 'p-error': v$.map_url.$invalid && submitted }">Map URL<span
                      class="p-error">*</span></label>
                  <InputText v-model="v$.map_url.$model" id="mapURL"
                    placeholder="Paste your venue location link from google maps"
                    :class="{ 'p-invalid': v$.map_url.$invalid && submitted }" />
                  <!-- <small v-if="(v$.map_url.$invalid && submitted) || v$.map_url.$pending.$response" class="p-error">
                    {{ v$.map_url.required.$message.replace('Value', 'Map URL') }}
                  </small>
                  <small v-else-if="(v$.map_url.$invalid && submitted) || v$.map_url.$pending.$response" class="p-error">
                    {{ v$.map_url.url.$message.replace('Value', 'Map URL') }}
                  </small> -->
                  <small v-if="(v$.map_url.$invalid && submitted && !v$.map_url.$dirty) || v$.map_url.$pending.$response"
                    class="p-error">
                    {{ v$.map_url.required.$message.replace('Value', 'Map URL') }}
                  </small>
                  <small v-else-if="v$.map_url.$dirty && v$.map_url.$invalid" class="p-error">
                    {{ v$.map_url.url.$message.replace('Value', 'Map URL') }}
                  </small>
                </div>
              </div>
              <h5>Date & Time</h5>
              <span>Please fill your event’s date and event time</span>
              <div class="grid mt-2">
                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="startDate" :class="{ 'p-error': v$.start_date.$invalid && submitted }">Start Date<span
                      class="p-error">*</span></label>
                  <Calendar id="startDate" v-model="v$.start_date.$model" placeholder="Select Start Date"
                    :class="{ 'p-invalid': v$.start_date.$invalid && submitted }" />
                  <small v-if="(v$.start_date.$invalid && submitted) || v$.start_date.$pending.$response" class="p-error">
                    {{ v$.start_date.required.$message.replace('Value', 'Start Date') }}
                  </small>
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="endDate" :class="{ 'p-error': v$.end_date.$invalid && submitted }">End Date<span
                      class="p-error">*</span></label>
                  <Calendar id="endDate" v-model="v$.end_date.$model" placeholder="Select End Date"
                    :class="{ 'p-invalid': v$.end_date.$invalid && submitted }" />
                  <small v-if="(v$.end_date.$invalid && submitted) || v$.end_date.$pending.$response" class="p-error">
                    {{ v$.end_date.required.$message.replace('Value', 'End Date') }}
                  </small>
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="startTime" :class="{ 'p-error': v$.start_time.$invalid && submitted }">Start Time<span
                      class="p-error">*</span></label>
                  <Calendar id="startTime" v-model="v$.start_time.$model" placeholder="Select Start Time"
                    :class="{ 'p-invalid': v$.start_time.$invalid && submitted }" :timeOnly="true" :showSeconds="true" />
                  <small v-if="(v$.start_time.$invalid && submitted) || v$.start_time.$pending.$response" class="p-error">
                    {{ v$.start_time.required.$message.replace('Value', 'Start Time') }}
                  </small>
                </div>
                <div class="field col-12 md:col-6 lg:col-6">
                  <label for="endTime" :class="{ 'p-error': v$.end_time.$invalid && submitted }">End Time<span
                      class="p-error">*</span></label>
                  <Calendar id="endTime" v-model="v$.end_time.$model" placeholder="Select End Time"
                    :class="{ 'p-invalid': v$.end_time.$invalid && submitted }" :timeOnly="true" :showSeconds="true" />
                  <small v-if="(v$.end_time.$invalid && submitted) || v$.end_time.$pending.$response" class="p-error">
                    {{ v$.end_time.required.$message.replace('Value', 'End Time') }}
                  </small>
                </div>
              </div>
              <div class="flex justify-content-end mt-3">
                <router-link :to="{ name: 'eventList' }">
                  <div>
                    <Button :label="$t('Cancel')" class="mt-2 p-button-outlined p-button-secondary" />
                  </div>
                </router-link>
                <div>
                  <Button type="submit" label="create" severity="primary" class="ml-2 mt-2 p-button-primary" />
                </div>
              </div>
            </form>
          </div>
        </TabPanel>

        <!-- Event Page  -->
        <TabPanel :header="panels[1].header" :disabled="activeTabIndex === 0">
          <div>
            <h5>Event Banner Images <span class="p-error">*</span></h5>
            <label for="">please upload your Banner images (maximum 5 photos).</label>
            <div class="image-upload" v-if="banner_images.length == 0">
              <div class="drag-area field col-12 md:col-12 lg:col-12" @dragover.prevent @dragenter.prevent
                @drop.prevent="dropHandlerBanner">
                <i class="pi pi-images upload-icon mt-5"></i>
                <p class="drag-text">Drag your photos here or click to upload</p>
                <br />
                <div class="flex justify-content-around image-info">
                  <span>Recommended image size: 2160 x 1080 px</span>
                  <span>Maximum file size per each: 10MB</span>
                  <span>Supported image files: JPEG or PNG</span>
                </div>
                <input type="file" id="file-input" style="display: none" @change="manualUploadBanner" multiple />
                <label for="file-input" class="upload-device">Upload from your device</label>
              </div>
            </div>

            <!-- Display uploaded images as thumbnails -->
            <div class="preview" v-if="banner_images.length > 0">
              <!-- Show selected image -->
              <div class="selected-image col-12 md:col-12 lg:col-12 p-0" v-if="selectedImageBanner">
                <img :src="selectedImageBanner.url" alt="Selected Image" />
              </div>
              <div class="image-item" v-for="image in banner_images" :key="image.id">
                <div class="delete-icon" @click="deleteImageBanner(image.id)">
                  <i class="pi pi-times-circle"></i>
                </div>
                <img :src="image.url" alt="Uploaded Image" @click="selectImageBanner(image)" />
              </div>
              <div v-if="banner_images.length < 5" class="file-upload-container">
                <input type="file" id="banner-img" style="display: none" @change="manualUploadBanner" multiple />
                <label for="banner-img" icon="" class="upload-button"> <i class="pi pi-plus-circle"></i> Add More </label>
              </div>
            </div>

            <h5>Contact Information</h5>
            <label for="">Please fill your event customer support</label>
            <div class="grid mt-2">
              <div class="field col-12 md:col-6 lg:col-6">
                <label for="phone">Phone Number <span class="p-error">*</span></label>
                <!-- <InputText id="phone" placeholder="Enter Phone Number" class="w-full" /> -->
                <InputNumber v-model="phone" inputId="phone" :useGrouping="false" placeholder="Enter Phone Number"
                  class="w-full" />
              </div>

              <div class="field col-12 md:col-6 lg:col-6">
                <label for="email">Email Address <span class="p-error">*</span></label>
                <InputText id="email" placeholder="Enter Your Email Address" class="w-full" type="email" />
              </div>
            </div>

            <h5>Social Media Link</h5>
            <label for="">Please fill your event’s social media</label>
            <div class="grid mt-2">
              <div class="field col-12 md:col-6 lg:col-6">
                <label for="facebook">Facebook (Optional)</label>
                <InputText id="facebook" placeholder="Paste your Facebook link" class="w-full" />
              </div>
              <div class="field col-12 md:col-6 lg:col-6">
                <label for="instagram">Instagram (Optional)</label>
                <InputText id="instagram" placeholder="Paste your Instagram link" class="w-full" />
              </div>
              <div class="field col-12 md:col-6 lg:col-6">
                <label for="twitter">X (Optional)</label>
                <InputText id="twitter" placeholder="Paste your Twitter link" class="w-full" />
              </div>
              <div class="field col-12 md:col-6 lg:col-6">
                <label for="linkedIn">LinkedIn (Optional)</label>
                <InputText id="linkedIn" placeholder="Paste your LinkedIn link" class="w-full" />
              </div>
            </div>

            <div class="card mt-5">
              <div class="flex justify-content-between">
                <h5 class="align-self-center mb-0 inline-flex">
                  <img src="/layout/images/sponsor-logo.svg" alt="sponsor-logo" class="mr-3" />
                  Event Sponsors (Optional)
                </h5>
                <Button class="add-btn p-button-secondary" label="Add" v-if="sponsorLevels.length == 0"
                  @click="addSponsorLevel" />
                <span v-else class="remove-section" @click="deleteAllSponsorLevels">Remove Section</span>
              </div>

              <div v-for="(sponsorLevel, index) in sponsorLevels" :key="sponsorLevel.id" class="col-12 pl-2 pr-0 card">
                <!-- Sponsor Level Form -->
                <div class="sponsor-level">
                  <h5>Sponsor Level {{ index + 1 }}</h5>
                  <div class="sponsor-delete-icon" @click="deleteSponsorLevel(index)">
                    <i class="pi pi-times-circle"></i>
                  </div>
                  <div class="">
                    <label for="sponsorLevelTitle" class="label">Sponsor Level Name</label>
                    <div class="mt-2">
                      <InputText v-model="sponsorLevel.title" id="sponsorLevelTitle" class="w-full" />
                    </div>
                  </div>
                  <!-- Sponsor Logo Images -->
                  <div class="preview">
                    <div class="image-item" v-for="image in sponsorLevel.logoImages" :key="image.id">
                      <div class="delete-icon" @click="deleteSponsorLogo(index, image.id)">
                        <i class="pi pi-times-circle"></i>
                      </div>
                      <img :src="image.url" alt="Uploaded Image" />
                    </div>
                    <div class="file-upload-container">
                      <input type="file" :id="'logo-img-' + index" style="display: none"
                        @change="manualUploadLogo(index, $event)" multiple />
                      <label :for="'logo-img-' + index" icon="" class="upload-button"> <i class="pi pi-plus-circle"></i>
                        Add More </label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Add More Button for Sponsor Levels -->
              <Button
                class="add-btn align-items-center justify-content-center p-button p-button-secondary p-component text-center w-full mt-4"
                @click="addSponsorLevel" v-if="sponsorLevels.length > 0">
                <i class="pi pi-plus-circle"></i>
                <span class="label">Add More Sponsor Level</span>
              </Button>
            </div>

            <div class="card mt-5">
              <div class="flex justify-content-between">
                <h5 class="align-self-center mb-0 inline-flex">
                  <img src="/layout/images/agenda-logo.svg" alt="no-tickets" class="mr-3" />
                  Agenda (Optional)
                </h5>
                <!-- <Button class="add-btn p-button-secondary" label="Add" @click="addAgendaTabview" /> -->
                <Button class="add-btn p-button-secondary" label="Add" v-if="agendaTabs.length == 0"
                  @click="addAgendaTabview" />
                <span v-else class="remove-section" @click="deleteAllAgenda">Remove Section</span>
              </div>
              <TabView :activeIndex="activeAgendaTabIndex" @onChange="handleAgendaTabChange" class="agenda-tab-view"
                v-if="agendaTabs.length > 0">
                <TabPanel v-for="(agendaTab, tabIndex) in agendaTabs" :key="tabIndex">
                  <template #header>
                    <span v-if="!isEditing[tabIndex]" @click="startEditing(tabIndex)">
                      {{ !editedAgenda[tabIndex] ? `Day ${tabIndex + 1} Agenda` : editedAgenda[tabIndex] }}
                    </span>
                    <InputText v-else v-model="editedAgenda[tabIndex]" @blur="stopEditing(tabIndex)"
                      @keyup.enter="stopEditing(tabIndex)" class="my-0 agenda-title" />
                    <i v-if="!isEditing[tabIndex]" class="pi pi-times-circle agenda-tab-delete-icon"
                      @click="removeAgendaTab(tabIndex)"></i>
                  </template>
                  <div v-for="(agenda, agendaFormIndex) in agendaForms" :key="agendaFormIndex" class="card">
                    <h5>Agenda Form {{ agendaFormIndex + 1 }}</h5>
                    <!-- Title -->
                    <div class="field">
                      <label for="agendaTitle" class="label">Title<span class="p-error">*</span></label>
                      <div class="mt-2">
                        <InputText v-model="agenda.title" :id="'agendaTitle_' + agendaFormIndex" class="w-full" />
                      </div>
                    </div>

                    <!-- Start and End Time -->
                    <div class="time-fields mr-4">
                      <div class="field col-12 md:col-6 lg:col-6 px-0">
                        <label for="agendaStartTime" class="label">Start Time</label>
                        <div class="mt-2">
                          <Calendar v-model="agenda.startTime" :id="'agendaStartTime_' + agendaFormIndex" class="w-full"
                            timeOnly />
                        </div>
                      </div>
                      <div class="field col-12 md:col-6 lg:col-6 px-0">
                        <label for="agendaEndTime" class="label">End Time</label>
                        <div class="mt-2">
                          <Calendar v-model="agenda.endTime" :id="'agendaEndTime_' + agendaFormIndex" class="w-full"
                            timeOnly />
                        </div>
                      </div>
                    </div>

                    <!-- Description -->
                    <div class="field mb-4" v-if="showDescription">
                      <label for="agendaDescription" class="label">Description</label>
                      <div class="mt-2">
                        <Textarea v-model="agenda.description" :id="'agendaDescription_' + agendaFormIndex"
                          class="w-full" />
                      </div>
                    </div>

                    <!-- Performer or speaker -->
                    <div class="grid">
                      <div v-for="(performer, performerIndex) in performers" :key="performerIndex"
                        class="performer-container col-6">
                        <div class="avatar-uploader">
                          <div class="avatar" @click="openFileInput(performerIndex)">
                            <img v-if="performer.imageUrl" :src="performer.imageUrl" alt="Avatar" />
                            <span v-else><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                viewBox="0 0 22 22" fill="none" style="margin-top: 10px;">
                                <path
                                  d="M19.3337 13.834L15.0774 9.5777C14.6478 9.14804 13.9513 9.14804 13.5217 9.5777L5.35132 17.7481C3.42494 16.1338 2.2 13.71 2.2 11C2.2 6.13989 6.13989 2.2 11 2.2C15.8601 2.2 19.8 6.13989 19.8 11C19.8 11.9915 19.636 12.9447 19.3337 13.834ZM7.2482 18.9625L14.2996 11.9111L18.3017 15.9133C16.7191 18.2603 14.0374 19.7998 10.9996 19.7998C9.65635 19.7998 8.38579 19.4995 7.2482 18.9625ZM11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22ZM9.9 8.8C9.9 10.0151 8.91506 11 7.7 11C6.48497 11 5.5 10.0151 5.5 8.8C5.5 7.58497 6.48497 6.6 7.7 6.6C8.91506 6.6 9.9 7.58497 9.9 8.8Z"
                                  fill="#6D6E71" />
                              </svg></span>
                          </div>
                          <input type="file" @change="handleFileChange(performerIndex, $event)" class="avatar-file"
                            :id="'avatarInput_' + performerIndex" />
                        </div>
                        <div class="w-full">
                          <InputText v-model="performer.name" :id="'performerName_' + performerIndex" class="w-full"
                            placeholder="Enter Performer or Speaker Name" />
                        </div>
                        <span class="performer-delete-icon cursor-pointer" @click="deletePerformer(performerIndex)">
                          <i class="pi pi-times-circle"></i>
                        </span>
                      </div>
                    </div>
                    <div class="my-5">
                      <span @click="addPerformer(performerIndex)" v-if="performers.length < 4"
                        class="mr-3 cursor-pointer"><i class="pi pi-user mr-2"></i> Speaker or Performer</span>
                      <span @click="showDescriptionForm" class="description  cursor-pointer"><i
                          class="pi pi-align-right mr-2"></i> Description</span>
                    </div>
                  </div>
                  <Button
                    class="add-btn align-items-center justify-content-center p-button p-button-secondary p-component text-center w-full mt-4"
                    @click="addAgendaForm(agendaFormIndex)" v-if="agendaForms.length > 0">
                    <i class="pi pi-plus-circle"></i>
                    <span class="label">Add New Agenda</span>
                  </Button>
                </TabPanel>
                <TabPanel class="fixed-tab-panel">
                  <template #header>
                    <i class="pi pi-plus-circle mr-2"></i>
                    <span class="" @click="addAgendaTabview(tabIndex)">Add New Day Agenda</span>
                  </template>
                </TabPanel>
              </TabView>
            </div>

            <div class="card mt-5">
              <div class="flex justify-content-between">
                <h5 class="align-self-center mb-0 inline-flex">
                  <img src="/layout/images/faq-logo.svg" alt="faq-logo" class="mr-3" />
                  FAQ (Optional)
                </h5>
                <Button class="add-btn p-button-secondary" label="Add" v-if="faqs.length == 0" @click="addFAQ" />
                <span v-else class="remove-section" @click="deleteAllFAQ">Remove
                  Section</span>
              </div>

              <!-- FAQ Form Section -->
              <div v-for="(faq, index) in faqs" :key="index" class="col-12 pl-2 pr-0 my-4 card">
                <!-- FAQ Form -->
                <div class="faq-form">
                  <h5>FAQ {{ index + 1 }}</h5>
                  <div class="delete-faq-icon" @click="deleteFAQ(index)">
                    <i class="pi pi-times-circle"></i>
                  </div>
                  <div class="field mb-4">
                    <label for="faqQuestion" class="label">Question</label>
                    <div class="mt-2">
                      <InputText v-model="faq.question" id="faqQuestion" class="w-full" />
                    </div>
                  </div>
                  <div class="field">
                    <label for="faqAnswer" class="label">Answer</label>
                    <div class="mt-2">
                      <Textarea v-model="faq.answer" id="faqAnswer" class="w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add More FAQ Button -->
              <Button
                class="add-btn p-button-secondary align-items-center justify-content-center p-button p-component text-center w-full mt-4"
                @click="addFAQ" v-if="faqs.length > 0">
                <i class="pi pi-plus-circle"></i>
                <span class="label">Add New Question</span>
              </Button>
            </div>

            <h5>Additional Information (Optional)</h5>
            <div class="grid">
              <div class="field col-12 md:col-12 lg:col-12">
                <label for="additionalInfo">Add more information to your event page (Terms and Conditions, Refund Policy,
                  etc...)</label>
                <Editor v-model="additionalInfo" editorStyle="height: 200px;"></Editor>
              </div>
            </div>

            <h5>Event Images</h5>
            <label for="">Show the customer how you prepare for your events</label>
            <div class="image-upload" v-if="uploadedImagesEvent.length == 0">
              <!-- <label for="file-input" class="field col-12 md:col-12 lg:col-12"> -->
              <div class="drag-area field col-12 md:col-12 lg:col-12" @dragover.prevent @dragenter.prevent
                @drop.prevent="dropHandlerEvent">
                <i class="pi pi-images upload-icon mt-5"></i>
                <p class="drag-text">Drag your photos here or click to upload</p>
                <br />
                <div class="flex justify-content-around image-info">
                  <span>Recommended image size: 2160 x 1080 px</span>
                  <span>Maximum file size per each: 10MB</span>
                  <span>Supported image files: JPEG or PNG</span>
                </div>
                <input type="file" id="event-img" style="display: none" @change="manualUploadEvent" multiple />
                <label for="event-img" class="upload-device">Upload from your device</label>
              </div>
            </div>
            <!-- Display uploaded images as thumbnails -->
            <div class="preview" v-if="uploadedImagesEvent.length > 0">
              <!-- Show selected image -->
              <div class="selected-image col-12 md:col-12 lg:col-12 p-0" v-if="selectedImageEvent">
                <img :src="selectedImageEvent.url" alt="Selected Image" />
              </div>
              <div class="image-item" v-for="image in uploadedImagesEvent" :key="image.id">
                <div class="delete-icon" @click="deleteImageEvent(image.id)">
                  <i class="pi pi-times-circle"></i>
                </div>
                <img :src="image.url" alt="Uploaded Image" @click="selectImageEvent(image)" />
              </div>
              <div v-if="uploadedImagesEvent.length < 5" class="file-upload-container">
                <input type="file" id="file-input" style="display: none" @change="manualUploadEvent" multiple />
                <label for="file-input" class="upload-button"> <i class="pi pi-plus-circle"></i> Add More </label>
              </div>
            </div>
            <div class="flex justify-content-end mt-3">
              <div>
                <Button :label="$t('Save')" class="ml-2 mt-2 p-button-primary" />
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Tickets  -->
        <TabPanel :header="panels[2].header" :disabled="activeTabIndex === 0 || activeTabIndex === 1">
          <div v-if="!showTicketForm">
            <div class="card">
              <div class="flex justify-content-between">
                <h1 class="ticket-title">Tickets</h1>
                <Button label="Create New Ticket" icon="pi pi-plus" severity="primary" @click="showNewTicketForm" />
              </div>
              <div v-if="tickets.length === 0" class="no-tickets">
                <div class="text-center">
                  <img src="/layout/images/no-tickets.svg" alt="no-tickets" />
                  <span class="no-tickets-text block">There is no Tickets yet!</span>
                </div>
                <div>
                  <Button label="Create New Ticket" icon="pi pi-plus" severity="primary" @click="showNewTicketForm" />
                </div>
              </div>
              <div v-else>
                <DataTable :value="tickets" :columns="columns" :frozenValue="frozenColumns" :scrollable="true">
                  <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header"
                    :sortable="column.sortable" :style="column.style" :frozen="column.frozen"
                    :alignFrozen="column.alignFrozen"></Column>
                </DataTable>
              </div>
            </div>
            <div class="flex justify-content-between mt-3">
              <div>
                <Checkbox v-model="checked" :binary="true" />
                <span>Absorb fees: Ticketing fees are deducted from your ticket revenue</span>
              </div>
              <div>
                <Button :label="$t('Save')" class="ml-2 mt-2 p-button-primary" />
              </div>
            </div>
          </div>
          <ticketForm v-if="showTicketForm" @cancel="hideNewTicketForm" />
        </TabPanel>

        <!-- Publish  -->
        <TabPanel :header="panels[3].header"
          :disabled="activeTabIndex === 0 || activeTabIndex === 1 || activeTabIndex === 2">
          <div class="event-url-form">
            <!-- Event URL Section -->
            <div class="mb-5">
              <div class="flex justify-content-between mb-3">
                <label for="eventUrl" class="label">Event URL</label>
                <label class="label">Preview Your Event</label>
              </div>
              <div class="p-inputgroup">
                <Button class="p-button p-button-secondary">https://eventnex.com/</Button>
                <InputText v-model="eventUrl" id="eventUrl" class="p-inputtext" />
              </div>
            </div>

            <!-- Who can see your event? Section -->
            <div class="event-visibility mb-5">
              <h5 class="publish-title">Who can see your event?</h5>
              <div class="flex">
                <RadioButton v-model="visibility" value="public" inputId="public" class="mr-2" />
                <label for="public">Public</label>
              </div>
              <p class="ml-5">Shared on EventNex</p>
              <div class="flex">
                <RadioButton v-model="visibility" value="private" inputId="private" class="mr-2" />
                <label for="private">Private</label>
              </div>
              <p class="ml-5">Will not appear on EventNex and only available through a link and search engines</p>
            </div>

            <!-- When will you publish your event? Section -->
            <div class="publish-section">
              <h5 class="publish-title">When will you publish your event?</h5>
              <div class="flex mb-3">
                <RadioButton v-model="publishOption" value="now" inputId="now" class="mr-2" />
                <label for="now">Publish Now</label>
              </div>
              <div class="flex mb-3">
                <RadioButton v-model="publishOption" value="schedule" inputId="schedule" class="mr-2" />
                <label for="schedule">Schedule Later</label>
              </div>
            </div>

            <!-- Schedule Fields (conditionally rendered) -->
            <div v-if="publishOption === 'schedule'" class="grid">
              <div class="field mb-3 col-6 md:col-3 lg:col-3">
                <label for="startDate" class="block">Start Date</label>
                <Calendar v-model="publishStartDate" id="publishStartDate" placeholder="Choose date" class="w-full" />
              </div>
              <div class="field mb-3 col-6 md:col-3 lg:col-3">
                <label for="startTime" class="block">Start Time</label>
                <Calendar v-model="publishStartTime" id="publishStartTime" placeholder="Choose time" timeOnly
                  class="w-full" />
              </div>
            </div>

            <div class="flex justify-content-end mt-3">
              <div>
                <Button label="Publish Now" class="ml-2 mt-2 p-button-primary" />
              </div>
            </div>
          </div>
        </TabPanel>
      </div>
    </TabView>
    <Loading v-if="isLoading" />
  </div>
</template>

<script setup>
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Editor from 'primevue/editor'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import RadioButton from 'primevue/radiobutton';
import Card from 'primevue/card'
import ticketForm from './component/ticketForm.vue'
import Checkbox from 'primevue/checkbox'
import MultiSelect from 'primevue/multiselect'
import Loading from '@/components/Loading.vue'

import useNew from './useNew'

const {
  handleSubmit,
  errors,
  submitted,
  v$,
  tabViewRef,
  activeTabIndex,
  panels,
  selectedTemplateIndex,
  selectedTemplate,
  isLocationSelected,
  handleVenue,
  handleOnlineEvent,
  banner_images,
  dropHandlerBanner,
  manualUploadBanner,
  deleteImageBanner,
  selectImageBanner,
  selectedImageBanner,
  uploadedImagesEvent,
  dropHandlerEvent,
  manualUploadEvent,
  deleteImageEvent,
  selectImageEvent,
  selectedImageEvent,
  sponsorLevels,
  addSponsorLevel,
  deleteAllSponsorLevels,
  deleteSponsorLevel,
  manualUploadLogo,
  deleteSponsorLogo,
  agendaTabs,
  activeAgendaTabIndex,
  addAgendaTabview,
  handleAgendaTabChange,
  addAgendaForm,
  agendaForms,
  faqs,
  addFAQ,
  deleteFAQ,
  deleteAllFAQ,
  deleteAllAgenda,
  removeAgendaTab,
  isEditing,
  editedAgenda,
  startEditing,
  stopEditing,
  performers,
  addPerformer,
  openFileInput,
  handleFileChange,
  deletePerformer,
  showDescription,
  showDescriptionForm,
  tickets,
  eventUrl,
  visibility,
  publishOption,
  showNewTicketForm,
  hideNewTicketForm,
  showTicketForm,
  templates,
  columns,
  checked,
  tags,
  types,
  organizers,
  categories,
  isLoading,
} = useNew()
</script>

<style lang="scss">
.custom-tab-view .p-tabview-nav li {
  width: 25%;
}

.agenda-tab-view .p-tabview-nav li {
  min-width: 200px;
}

.custom-tab-view .p-tabview-nav li:not(:nth-child(4)) {
  border-right: 1px solid #ccc;
  /* Adjust the color and style as needed */
}

.p-tabview .p-tabview-nav {
  border-color: white !important;
  padding: 20px 20px 0 20px;
}

.image-upload {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 14px;
}

.drag-area {
  border: 1px dashed #2f343b;
  padding: 20px;
  text-align: center;
  width: 100%;
  cursor: pointer;
  border-radius: 10px;
  height: 466px;
}

.upload-icon {
  font-size: 82px;
  margin-top: 40px;
  margin-bottom: 30px;
}

.preview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 14px;
}

.selected-image {
  height: 511px;
  border: 1px solid #2f343b;
  border-radius: 3px;
}

.image-item img,
.selected-image img {
  width: 100%;
  height: -webkit-fill-available;
}

.drag-text {
  color: #2f343b;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.upload-device {
  font-size: 17.5px;
  font-style: normal;
  font-weight: 600;
  line-height: 21px;
  border-bottom: 1px solid #2f343b;
  margin-top: 86px;
}

.image-info {
  color: #2f343b;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 1px;
}

.image-item {
  position: relative;
  width: 144px;
  height: 72px;
  border: 1px dashed #2f343b;
  border-radius: 4px;
}

.delete-icon {
  position: absolute;
  top: 1px;
  right: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  color: #ccc;
}

.delete-icon i {
  color: #ccc;
  font-size: 20px;
}

.file-upload-container {
  position: relative;
  text-align: center;
}

.upload-button {
  display: inline-block;
  padding: 25px;
  width: 144px;
  height: 72px;
  border: 1px dashed #2f343b;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
}

.upload-button i {
  font-size: 12px;
}

.add-btn {
  border-radius: 6px;
  display: flex;
  padding: 10.5px 17.5px;
  align-items: flex-start;
  gap: 14px;
}

.sponsor-level,
.faq-form {
  position: relative;
}

.sponsor-delete-icon,
.delete-faq-icon {
  position: absolute;
  top: 0;
  right: 10px;
  cursor: pointer;
}

.sponsor-delete-icon i,
.delete-faq-icon i {
  font-size: 24px;
}

.remove-section {
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 50px;
  color: red;
}

.agenda-tab-view .p-tabview-nav li:nth-last-child(2) {
  position: sticky !important;
  top: 0;
  right: 0;
  width: 300px;
  z-index: 1000;
}

.agenda-tab-view .p-tabview-nav li .agenda-title {
  padding: 6px !important;
}

.agenda-tab-view .agenda-tab-delete-icon {
  cursor: pointer;
  position: absolute;
  top: 6px;
  right: 6px;
}

.time-fields {
  display: flex;
  gap: 20px;
  /* Adjust the gap between fields */
}

.performer-container {
  gap: 15px;
  display: flex;
  align-items: center;
}

.avatar-uploader {
  position: relative;
  width: 42px;
  height: 42px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background-color: #ccc;
}

.avatar span {
  font-size: 24px;
  padding: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-file {
  display: none;
}

.performer-delete-icon i {
  font-size: 28px;
}

.cursor-pointer {
  cursor: pointer;
}

.ticket-title {
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.no-tickets {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 60px;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 3px;
  border: 2px dashed #E0E0E0;
  height: 500px;
  margin-top: 15px;
}

.no-tickets-text,
.publish-title {
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card-container .p-card {
  min-width: 319px;
}

.card-image {
  min-width: 295px;
  width: 100%;
  height: 195px;
  object-fit: contain;
}

.p-card-header {
  position: relative;
}

.card-tag {
  position: absolute;
  top: 12px;
  left: 27px;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
}

.p-card-content {
  padding: 0 !important;
}

.selected-card {
  border: 4px solid #0063F7;
}
</style>
