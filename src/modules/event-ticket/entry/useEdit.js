import { reactive, ref, onBeforeUnmount, computed, watch, onMounted } from 'vue'
import { required, url } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useStore } from '../store'
import { Errors } from '@/utils/serverValidation'
import { useRoute, useRouter} from 'vue-router'
import { format } from 'date-fns';

export default function useEdit() {
  const state = reactive({
    id: null,
    title: "",
    organizer_id: null,
    organizer_name: "",
    event_template: "",
    type_id: null,
    type_name: "",
    category_id: null,
    category_name: "",
    slug: "",
    tags: [],
    summary: "",
    about: "",
    location_types: "",
    venue_address: "",
    online_address: null,
    map_url: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    banner_images: [],
    additional_information: "",
    event_images: [],
    visibility: "PUBLIC",
    publish_at: "",
    agenda: [],
    faqs: [],
    sponsors: [],
    contact_information: [
      {
          phone_number: "",
          email: ""
      }
    ],
    social_links: {
      facebook_url: "",
      instagram_url: "",
      twitter_url: "",
      linkedin_url: ""
    },
    event_status: "ACTIVE",
    event_tickets: [
      {
        id: null,
        event_id: null,
        name: "",
        entry_date: "",
        price: null,
        ticket_types: "",
        initial_quantity: null,
        remaining_quantity: null,
        sale_start_at: "",
        sale_end_at: "",
        description: "",
        early_price: null,
        early_start_at: "",
        early_end_at: "",
        ticket_visibility: "SHOW",
        is_deleted: false,
      },
    ],
  });
  const store = useStore()
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(true)
  const showCropDialog = ref(false)
  const errors = new Errors()
  const tabViewRef = ref(null)
  const activeTabIndex = ref(0)
  const panels = [
    { header: 'Event Details' },
    { header: 'Event Page' },
    { header: 'Tickets' },
    { header: 'Publish' }
  ]

  const columns = ref([
    {
      field: 'name',
      header: 'Name',
      sortable: false,
      selected: true,
      style: 'min-width: 13rem'
    },
    {
      field: 'price',
      header: 'Price',
      sortable: true,
      selected: true,
      style: 'min-width: 13rem'
    },
    {
      field: 'initial_quantity',
      header: 'Quantity',
      sortable: true,
      selected: true,
      style: 'min-width: 12rem'
    },
    {
      field: 'ticket_status',
      header: 'Status',
      sortable: false,
      selected: true,
      style: 'min-width: 12rem'
    },
    {
      field: 'actions',
      header: 'Action',
      sortable: false,
      selected: true,
      style: 'min-width: 15rem; max-width: 15rem',
      frozen: true,
      alignFrozen: 'right'
    }
  ]);

  const handleTabChange = (event) => {
    activeTabIndex.value = event.index
  }



  const templates = ref([
    {
      title: 'DEFAULT',
      image: '/layout/images/template-image/default.png',
      tag: 'Free',
    },
    {
      title: 'TEMPLATE_1',
      image: '/layout/images/template-image/template1.png',
      tag: 'Premium',
    },
    {
      title: 'TEMPLATE_2',
      image: '/layout/images/template-image/template2.png',
      tag: 'Premium',
    },
  ]);

  const selectedTemplateIndex = ref(0);
  state.event_template= ref(templates.value[0].title);

  const selectedTemplate = (index) => {
    selectedTemplateIndex.value = index;
    state.event_template = templates.value[index].title;
  }
  
  const isLocationSelected = ref('VENUE');
  state.location_types = isLocationSelected.value;
  
  const  handleVenue = () => {
    isLocationSelected.value = 'VENUE';
    state.location_types = isLocationSelected;
  }

  const  handleOnlineEvent = () => {
    isLocationSelected.value = 'ONLINE';
    state.location_types = isLocationSelected;
  }

  const banner_images = ref([])
  const selectedImageBanner = ref(null)
  const banner_image_name = ref([]);
  const MAX_ALLOWED_SIZE = 2 * 1024 * 1024;

  const dropHandlerBanner = async (event) => {
    const files = event.dataTransfer.files
    isLoading.value = true;
    const totalImages = state.banner_images ? state.banner_images.length : 0;
    const remainingSlots = 5 - totalImages;

    if (remainingSlots >= files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > MAX_ALLOWED_SIZE) {
          alert('File size exceeds 2 MB limit. Please select a smaller file.');
          isLoading.value = false;
          return; 
        }
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            try {
                await store.uploadFile(file);

                const response = store.getUploadFileResponse

                if (response) {
                    const newImage = {
                        id: response.data[0].id,
                        url: response.data[0].file_url,
                    };

                    banner_images.value.push(newImage);
                    const fileName = newImage.url.split("/").pop();
                    banner_image_name.value.push(fileName);
                    if (banner_image_name.value.length > 0) {
                        selectedImageBanner.value = banner_image_name.value[0];
                    }
                }
            } catch (error) {
                console.error('Error uploading file:', error.message);
            }
        } else {
            console.log('Invalid file format. Please upload JPEG or PNG images.');
        }
      }
      if (!state.banner_images) {
        state.banner_images = [...banner_image_name.value];
        banner_image_name.value = [];
    } else {
        const bnr_images = [...state.banner_images, ...banner_image_name.value];
        state.banner_images = bnr_images;
        banner_image_name.value = [];
    }
    } else {
      alert('You can upload a maximum of 5 images.');
    }
    isLoading.value = false;
  }

  const manualUploadBanner = async (event) => {
    const files = event.target.files;
    isLoading.value = true;

    const totalImages = state.banner_images ? state.banner_images.length : 0;
    const remainingSlots = 5 - totalImages;

    if (remainingSlots >= files.length) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.size > MAX_ALLOWED_SIZE) {
              alert('File size exceeds 2 MB limit. Please select a smaller file.');
              isLoading.value = false;
              return;
          }
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                try {
                    await store.uploadFile(file);

                    const response = store.getUploadFileResponse;

                    if (response) {
                        const newImage = {
                            id: response.data[0].id,
                            url: response.data[0].file_url,
                        };

                        banner_images.value.push(newImage);
                        const fileName = newImage.url.split("/").pop();
                        banner_image_name.value.push(fileName);
                        if (banner_image_name.value.length > 0) {
                            selectedImageBanner.value = banner_image_name.value[0];
                        }
                    }
                } catch (error) {
                    console.error('Error uploading file:', error.message);
                }
            } else {
                console.log('Invalid file format. Please upload JPEG or PNG images.');
            }
        }

        if (!state.banner_images) {
            state.banner_images = [...banner_image_name.value];
            banner_image_name.value = [];
        } else {
            const bnr_images = [...state.banner_images, ...banner_image_name.value];
            state.banner_images = bnr_images;
            banner_image_name.value = [];
        }
    } else {
      alert('You can upload a maximum of 5 images.');
    }

    isLoading.value = false;
  };


  const selectImageBanner = (image) => {
    selectedImageBanner.value = image
  }

  const deleteImageBanner = (image) => {
    if (selectedImageBanner.value && selectedImageBanner.value === image) {
      selectedImageBanner.value = null
    }
    const index = state.banner_images.findIndex((img) => img === image)
    if (index !== -1) {
      state.banner_images.splice(index, 1)
      if (state.banner_images && selectedImageBanner.value == null) {
        selectedImageBanner.value = state.banner_images[0]
      }
    }
  }
  const event_images = ref([])
  const selectedImageEvent = ref(null)
  const event_image_name = ref([]);

  const dropHandlerEvent = async (event) => {
    const files = event.dataTransfer.files
    isLoading.value = true;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
          try {
              await store.uploadFile(file);

              const response = store.getUploadFileResponse

              if (response) {
                  const newImage = {
                      id: response.data[0].id,
                      url: response.data[0].file_url,
                  };

                  event_images.value.push(newImage);
                  const fileName = newImage.url.split("/").pop();
                  event_image_name.value.push(fileName);
                  if (event_image_name.value.length > 0) {
                    selectedImageEvent.value = event_image_name.value[0];
                  }
              }
          } catch (error) {
              console.error('Error uploading file:', error.message);
          }
      } else {
          console.log('Invalid file format. Please upload JPEG or PNG images.');
      }
    }
    if (!state.event_images) {
      state.event_images = [...event_image_name.value];
      event_image_name.value = [];
    } else {
      const images = [...state.event_images, ...event_image_name.value];
      state.event_images = images;
      event_image_name.value = [];
    }
    isLoading.value = false;
  }

  const manualUploadEvent = async (event) => {
    const files = event.target.files

    isLoading.value = true

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
          try {
              await store.uploadFile(file);

              const response = store.getUploadFileResponse

              if (response) {
                  const newImage = {
                      id: response.data[0].id,
                      url: response.data[0].file_url,
                  };

                  event_images.value.push(newImage);
                  const fileName = newImage.url.split("/").pop();
                  event_image_name.value.push(fileName);
                  if (event_image_name.value.length > 0) {
                    selectedImageEvent.value = event_image_name.value[0];
                  }
              }
          } catch (error) {
              console.error('Error uploading file:', error.message);
          }
      } else {
          console.log('Invalid file format. Please upload JPEG or PNG images.');
      }
    }
    if (!state.event_images) {
      state.event_images = [...event_image_name.value];
      event_image_name.value = [];
    } else {
      const images = [...state.event_images, ...event_image_name.value];
      state.event_images = images;
      event_image_name.value = [];
    }
    isLoading.value = false;
  }

  const selectImageEvent = (image) => {
    selectedImageEvent.value = image
  }

  const deleteImageEvent = (image) => {
    if (selectedImageEvent.value && selectedImageEvent.value === image) {
      selectedImageEvent.value = null
    }
    const index = state.event_images.findIndex((img) => img === image)
    if (index !== -1) {
      state.event_images.splice(index, 1)
      if (state.event_images && selectedImageEvent.value == null) {
        selectedImageEvent.value = state.event_images[0]
      }
    }
  }

  const sponsorLevels = ref([]);

  // Add Sponsor Level
  const addSponsorLevel = (index) => {
    const newSponsorLevel = {
      id: Date.now(),
      tier: '',
      images: [],
      order: index
    };
    if (!state.sponsors) {
      state.sponsors = [newSponsorLevel];
    } else {
      state.sponsors.push(newSponsorLevel);
    }
  }

  const deleteSponsorLevel = (index) => {
    sponsorLevels.value = state.sponsors;
    sponsorLevels.value.splice(index, 1);
  }

  const deleteAllSponsorLevels = () => {
    state.sponsors = [];
  }

  const deleteAllAgenda = () => {
    state.agenda = [];
  }

  const deleteAgendaForm = (tabIndex, agendaFormIndex) => {
    state.agenda[tabIndex].slots.splice(agendaFormIndex, 1);
  }

  const uploadedImagesLogo = ref([])
  const deleteSponsorLogo = (index, imageId) => {
    const level = state.sponsors[index]
    const imageIndex = level.images.find((image) => image.id === imageId)
    if (imageIndex !== -1) {
      deleteS3Image(imageIndex.url);
      level.images.splice(imageIndex, 1)
    }
    state.sponsors[index].images = level.images
    updateSponsor();
  }

  const updateSponsor = async () => {
    errors.clear();
    isLoading.value = true;
  
    try {
      await store.update({
        id: route.params.id,
        title: state.title,
        organizer_id: state.organizer_id,
        organizer_name: state.organizer_name,
        event_template: state.event_template,
        type_id: state.type_id,
        type_name: state.type_name,
        category_id: state.category_id,
        category_name: state.category_name,
        slug: state.slug,
        tags: state.tags,
        about: state.about,
        location_types: state.location_types,
        venue_address: state.venue_address,
        online_address: state.online_address,
        map_url: state.map_url,
        start_date: state.start_date,
        end_date: state.end_date,
        start_time: state.start_time,
        end_time: state.end_time,
        sponsors: state.sponsors,  // Update only the sponsors data
        _method: 'PUT'
      });
  
      const response = store.getUpdateResponse;
  
      if (response) {
        fetchEvent();
      }
  
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
      if (error.status === 422) {
        const err = error.data.data;
        errors.record(err);
      }
    }
  };

  // Function to manually upload logo images for a sponsor level
  const manualUploadLogo = async (levelIndex, event) => {
    const files = event.target.files
    const sponsor_images = ref([])
    const sponsorLevel = state.sponsors[levelIndex]
    state.sponsors[levelIndex].images = state.sponsors[levelIndex].images ?? [];
    if (sponsorLevel && sponsorLevel.images) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        await store.uploadFile(file);

        const response = store.getUploadFileResponse

        if (response) {
          const fileName = response.data[0].file_url.split("/").pop();
          const newLogoImage = {
            id: response.data[0].id,
            name: fileName,
            url: response.data[0].file_url,
            order: levelIndex
          }
          sponsor_images.value.push(newLogoImage)
        }
      }
    }
    if(state.sponsors[levelIndex].images) {
      state.sponsors[levelIndex].images = [...state.sponsors[levelIndex].images, ...sponsor_images.value];
    } else {
      state.sponsors[levelIndex].images = sponsor_images.value;
    }
  }

  const agendaTabs = ref([])
  const activeAgendaTabIndex = ref(0)

  const agendaForms = ref([
    {
      id: null,
      name: "",
      slots: [
          {
            id: null,
            title: "",
            start_at: "",
            end_at: "",
            performers: [
              {
                id: null,
                name: "", 
                image: ""
              } 
            ],
            description: "",
            order: "",
          },
        ],
        order: null,
    }
  ]);

  const addAgendaTabview = () => {
    if(state.agenda) {
      state.agenda = [...state.agenda, ...agendaForms.value]
    } else {
      state.agenda = agendaForms.value;
    }
    activeAgendaTabIndex.value = state.agenda.length - 1
  }

  const handleAgendaTabChange = (event) => {
    activeAgendaTabIndex.value = event.index
  }

  const addAgendaForm = (tabIndex) => {
    const newAgendaForm = {
      id: null,
      title: "",
      start_at: "",
      end_at: "",
      performers: [
        {
          id: null,
          name: "", 
          image: ""
        } 
      ],
      description: "",
      order: "",
    };

    if(state.agenda) {
      state.agenda[tabIndex].slots =[...state.agenda[tabIndex].slots, newAgendaForm ]
    } else {
      state.agenda[tabIndex].slots = newAgendaForm
    }
  };



  const removeAgendaTab = (index) => {
    state.agenda.splice(index, 1);
    if (index <= activeAgendaTabIndex.value) {
      activeAgendaTabIndex.value--;
    }
  };

  const editedAgenda = ref([]);
    const isEditing = ref([]);

  const startEditing = (index) => {
    isEditing.value[index] = true;
    editedAgenda.value[index] = agendaTabs.value[index].title;
  };

  const stopEditing = (index) => {
    isEditing.value[index] = false;
    agendaTabs.value[index].title = editedAgenda.value[index];
  };

  const performers = ref([]);

  const imageUrl = ref(null);

  const openFileInput = (index) => {
    const input = document.getElementById(`avatarInput_${index}`);
    if (input) {
      input.click();
    }
  };

  const handleFileChange =  async (tabIndex,agendaFormIndex,performerIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      await store.uploadFile(file);

    const response = store.getUploadFileResponse

      if(response) {
        const fileName = response.data[0].file_url.split("/").pop();
        const newImage = {
              id: response.data[0].id,
              image: fileName,
          };
        state.agenda[tabIndex].slots[agendaFormIndex].performers[performerIndex] = newImage;
      }
    }
  };

  const deletePerformer = (tabIndex,agendaFormIndex,performerIndex) => {
    performers.value = state.agenda[tabIndex].slots[agendaFormIndex].performers
    performers.value.splice(performerIndex, 1);
  };

  const addPerformer = (tabIndex, agendaFormIndex) => {
    const newPerformer = { 
      id: null,
      name: "", 
      image: "" 
    };
    performers.value.push(newPerformer);
    if(state.agenda[tabIndex].slots[agendaFormIndex].performers) {
      state.agenda[tabIndex].slots[agendaFormIndex].performers = [...state.agenda[tabIndex].slots[agendaFormIndex].performers, performers.value];
    } else {
      state.agenda[tabIndex].slots[agendaFormIndex].performers = performers.value;
    }
  };

  const showDescription = ref(false);

    const showDescriptionForm = () => {
      showDescription.value = true;
    };

  const faqs = ref([])

  const addFAQ = () => {
    const newFAQ = {
      question: '',
      answer: ''
    }
    if (!state.faqs) {
      state.faqs = [newFAQ];
    } else {
      state.faqs.push(newFAQ);
    }
  }

  const deleteFAQ = (index) => {
    faqs.value = state.faqs
    faqs.value.splice(index, 1)
  }

  const deleteAllFAQ = () => {
    state.faqs = [];
  };

  const ticket_visibilities = ref([
    { name: 'SHOW', code: 'SHOW' },
    { name: 'HIDE', code: 'HIDE' },
    { name: 'SHOW_ON_SALE', code: 'SHOW_ON_SALE' }
  ])

  const isTicketSelected = ref('PAID');

  const handleFreeTicket = () => {
      isTicketSelected.value = 'FREE';
  }

  const handlePaidTicket = () => {
      isTicketSelected.value = 'PAID';
  }

  const eventUrl = ref('');
  const previewEventUrl = ref('');
  // const visibility = ref('PUBLIC');
  const visibilities = ref([
    { name: 'PUBLIC', code: 'PUBLIC', label: 'Shared on EventNex'},
    { name: 'PRIVATE', code: 'PRIVATE', label: 'Will not appear on EventNex and only available through a link and search engines'},
  ])

  const showTicketForm = ref(false);
  const showTicketList = ref(true);

  const newTicketData = ref([]);
  const eventId = ref(null);

  const showNewTicketForm = () => {
    showTicketForm.value = true;
    showTicketList.value = false;
    isEditMode.value = false;
    eventId.value = state.id;
    const newTicket = {
      id: null,
      name: "",
      entry_date: "",
      event_id: state.id,
      price: null,
      ticket_types: "",
      initial_quantity: null,
      remaining_quantity: null,
      sale_start_at: "",
      sale_end_at: "",
      description: "",
      early_price: null,
      early_start_at: "",
      early_end_at: "",
      ticket_visibility: "SHOW",
      is_deleted: false,
    }
    newTicketData.value.push(newTicket);
  };
  const isEditMode = ref(false);
  const startEditMode = (id) => {
    isEditMode.value = true;
    showTicketForm.value = true;
    showTicketList.value = false;
    const findTicket = state.event_tickets.find(ticket => ticket.id === id);
    newTicketData.value = [];
    newTicketData.value.push(findTicket);
  };

  const ticketCancel = () => {
    showTicketForm.value = false;
    showTicketList.value = true;
    isEditMode.value = false;
    newTicketData.value = [];
  }

  const handleChildFormSubmission = (formData) => {
    showTicketForm.value = false;
    showTicketList.value = true;
    const tickets = ref([]);
    const updateId = formData.id;
    const findTicket = state.event_tickets.find(ticket => ticket.id == updateId);
    tickets.value.push(formData);
    if(findTicket && formData != null) {
      const updatedEventTickets = state.event_tickets.map(ticket =>
        ticket.id === updateId ? formData : ticket
      );
      state.event_tickets = updatedEventTickets;
    }
    else if(state.event_tickets && !findTicket) {
      state.event_tickets = [...state.event_tickets, ...tickets.value];
    } else {
      state.event_tickets = tickets.value;
    }
  };

  const backTicketList = () => {
    showTicketForm.value = false;
    showTicketList.value = true;
    const newTicket = {
      id: null,
      name: "",
      entry_date: "",
      price: null,
      ticket_types: "",
      initial_quantity: null,
      remaining_quantity: null,
      sale_start_at: "",
      sale_end_at: "",
      description: "",
      early_price: null,
      early_start_at: "",
      early_end_at: "",
      ticket_visibility: "SHOW",
      is_deleted: false,
    }
    const tickets = ref([]);
    tickets.value.push(newTicket);
    if(state.event_tickets) {
      state.event_tickets = [...state.event_tickets, tickets.value];
    } else {
      state.event_tickets = tickets.value;
    }
  };

  const publishStartDate = ref('');
  const publishStartTime = ref('');

  const types = ref([]);

  const fetchType = async () => {
    isLoading.value = true
    //fetch API
    await store.fetchAllType()
    //get response
    const response = store.getAllTypeResponse
    if (response) {
      const  options  = response.data
      for (let i = 0; i < options.length; i += 1) {
        types.value.push({ name: options[i].name, id: options[i].id })
      }
    }
    isLoading.value = false
  }

  const selectedTags = ref([]);
  const tags = ref([]);

  const fetchTags = async () => {
    isLoading.value = true
    //fetch API
    await store.fetchAllTag()
    //get response
    const response = store.getAllTagResponse
    if (response) {
      const options = response.data
      for (let i = 0; i < options.length; i += 1) {
        tags.value.push({ name: options[i].name, id: options[i].id })
      }
    }
    state.tags = tags.value;
    isLoading.value = false
  }

  const categories = ref([]);

  const fetchCategory = async () => {
    isLoading.value = true
    //fetch API
    await store.fetchAllCategory()
    //get response
    const response = store.getAllCategoryResponse
    if (response) {
      const options = response.data
      for (let i = 0; i < options.length; i += 1) {
        categories.value.push({ name: options[i].name, id: options[i].id })
      }
    }
    isLoading.value = false
  }

  const organizers = ref([]);

  const fetchOrganizer = async () => {
    isLoading.value = true
    //fetch API
    await store.fetchAllOrganizer()
    //get response
    const response = store.getAllOrganizerResponse
    if (response) {
      const options = response.data
      for (let i = 0; i < options.length; i += 1) {
        organizers.value.push({ name: options[i].name, id: options[i].id })
      }
    }
    isLoading.value = false
  }

  const deleteS3Image = async (id) => {
    isLoading.value = true

    await store.deleteS3Image({ id: id })
    store.getDeleteS3ImageResponse

    isLoading.value = false
  }

  onMounted(() => {
    fetchTags();
    fetchType();
    fetchCategory();
    fetchOrganizer();
    fetchEvent();
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const event_tickets = ref([]);

  const deleteTicket = async (id) => {
    const selectedTicket = state.event_tickets.find(ticket => ticket.id === id);
    selectedTicket.is_deleted = true;
    const deleteEventTickets = state.event_tickets.map(ticket =>
      ticket.id === selectedTicket.id ? selectedTicket : ticket
    );
    state.event_tickets = deleteEventTickets;
  }

  const rules = computed(() => {
    const basicRules = {
      title: { required },
      type_id: { required },
      organizer_id: { required },
      category_id: { required },
      tags: { required },
      about: { required },
      start_date: {required},
      end_date: {required},
      start_time: {required},
      end_time: {required},
      // banner_images: {size: maxSize(MAX_ALLOWED_SIZE)},
      // banner_images: {fileSize: maxSize(2 * 1024 * 1024)},
    }

    if (state.location_types === 'VENUE') {
      Object.assign(basicRules, {
        venue_address: { required},
        map_url: { required, url},
      });
    } else if (state.location_types === 'ONLINE') {
      Object.assign(basicRules, {
        online_address: { required},
      });
    }
    return basicRules
  })

  const v$ = useVuelidate(rules, state)

  const submitted = ref(false);

  const draftSave = (isFormValid) => {
    state.event_status = 'DRAFT';
    handleSubmit(isFormValid);
  }

  const publishOption = ref('now');

  const handleSubmit = (isFormValid) => {
    if(state.organizer_id) {
      const selectedOrganizer = organizers.value.find(org => org.id === state.organizer_id);
      state.organizer_name = selectedOrganizer.name;
    }

    if(state.type_id) {
      const selectedType = types.value.find(org => org.id === state.type_id);
      state.type_name = selectedType.name;
    }

    if(state.category_id) {
      const selectedCategory = categories.value.find(org => org.id === state.category_id);
      state.category_name = selectedCategory.name;
    }

    if(state.event_tickets && state.event_tickets.length > 0) {
      const ticketArray = state.event_tickets.map(ticket => {
        const formattedEntryDate = format(ticket.entry_date, 'yyyy-MM-dd');
        const formattedSaleStartAt = format(ticket.sale_start_at, 'yyyy-MM-dd HH:mm:ss');
        const formattedSaleEndAt = format(ticket.sale_end_at, 'yyyy-MM-dd HH:mm:ss');
        const formattedEarlyStartAt = ref(null);
        if(ticket.early_start_at) {
          formattedEarlyStartAt.value = format(ticket.early_start_at, 'yyyy-MM-dd HH:mm:ss');
        }
        const formattedEarlyEndAt = ref(null);
        if(ticket.early_end_at) {
          formattedEarlyEndAt.value = format(ticket.early_end_at, 'yyyy-MM-dd HH:mm:ss');
        }
        return { ...ticket, 
          entry_date: formattedEntryDate,
          sale_start_at: formattedSaleStartAt,
          sale_end_at: formattedSaleEndAt,
          early_start_at: formattedEarlyStartAt.value,
          early_end_at: formattedEarlyEndAt.value
        };
      });
      state.event_tickets = ticketArray;
    }

    const publishDateTime = ref(null)
    if(publishOption.value == 'schedule') {
      if (publishStartDate.value && publishStartTime.value) {
        const startDate = new Date(publishStartDate.value);
        const startTime = new Date(publishStartTime.value);
        const dateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
        startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
        publishDateTime.value = format(dateTime, 'yyyy-MM-dd HH:mm:ss');
        state.publish_at = publishDateTime.value;
        publishOption.value = 'schedule'
      }
    } else {
      state.publish_at = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');
    }

    if(state.start_time && state.start_time.length != 8) {
      const startTime = format(state.start_time, 'HH:mm:ss');
      state.start_time = startTime;
    }

    if(state.end_time && state.end_time.length != 8) {
      const endTime = format(state.end_time, 'HH:mm:ss')
      state.end_time = endTime
      
    }

    submitted.value = true

    if (!isFormValid) {
      return
    }

    if (!isLoading.value) {
      updateEvent()
    }
  }

  const fetchEvent = async () => {
    isLoading.value = true
    errors.clear()

    await store.fetchOne({
      id: route.params.id
    })

    const response = store.getOneResponse
    if (response) {
      state.id = response.data.id
      state.title = response.data.title
      state.organizer_id = response.data.organizer_id
      state.organizer_name = response.data.organizer_name
      state.event_template = response.data.event_template
      state.type_id = response.data.type_id
      state.type_name = response.data.type_name
      state.category_id = response.data.category_id
      state.category_name = response.data.category_name
      state.slug = response.data.slug
      state.tags = response.data.tags
      state.about = response.data.about
      state.location_types = response.data.location_types
      state.venue_address = response.data.venue_address
      state.online_address = response.data.online_address
      state.map_url = response.data.map_url
      state.start_date = format(response.data.start_date, 'yyyy-MM-dd');
      state.end_date = format(response.data.end_date, 'yyyy-MM-dd');
      state.start_time = response.data.start_time;
      state.end_time = response.data.end_time;
      state.banner_images = response.data.banner_images
      state.contact_information = response.data.contact_information
      state.social_links = response.data.social_links
      state.additional_information = response.data.additional_information
      state.event_images = response.data.event_images
      state.publish_at = response.data.publish_at
      state.visibility = response.data.visibility
      state.agenda = response.data.agenda
      state.faqs = response.data.faqs
      state.sponsors = response.data.sponsors
      state.event_tickets = response.data.event_tickets

      if (state.banner_images) {
        selectedImageBanner.value = state.banner_images[0]
      }
      if (state.event_images) {
        selectedImageEvent.value = state.event_images[0]
      }
    }

    isLoading.value = false
  }

  watch(
    () => state,
    () => {
      errors.clear()
    },
    { deep: true }
  )

  const filteredTickets = computed(() => state.event_tickets.filter(ticket => !ticket.is_deleted));

  const updateEvent = async () => {
    errors.clear()
    isLoading.value = true

    try {
      await store.update({
        id: route.params.id,
        title: state.title,
        organizer_id: state.organizer_id,
        organizer_name: state.organizer_name,
        event_template: state.event_template,
        type_id: state.type_id,
        type_name: state.type_name,
        category_id: state.category_id,
        category_name: state.category_name,
        slug: state.slug,
        tags: state.tags,
        about: state.about,
        location_types: state.location_types,
        venue_address: state.venue_address,
        online_address: state.online_address,
        map_url: state.map_url,
        start_date: state.start_date,
        end_date: state.end_date,
        start_time: state.start_time,
        end_time: state.end_time,
        banner_images: state.banner_images,
        contact_information: state.contact_information,
        social_links: state.social_links,
        additional_information: state.additional_information,
        event_images: state.event_images,
        publish_at: state.publish_at,
        visibility: state.visibility,
        agenda: state.agenda,
        faqs: state.faqs,
        sponsors: state.sponsors,
        event_tickets: state.event_tickets,
        event_status: state.event_status,
        _method: 'PUT'
      })

      const response = store.getUpdateResponse

      if (response) {
        if(activeTabIndex.value == 3) {
          router.push({ name: 'eventList'});
        }
        else if(activeTabIndex.value < 3) {
          activeTabIndex.value = activeTabIndex.value + 1 ;
        }
        fetchEvent();
      }

      isLoading.value = false
    } catch (error) {
      console.log(error)
      isLoading.value = false
      if (error.status === 422) {
        const err = error.data.errors
        errors.record(err)
      }
    }
  }

  return {
    handleTabChange,
    handleSubmit, 
    submitted,
    isLoading,
    state,
    errors,
    v$,
    tabViewRef,
    activeTabIndex,
    panels,
    selectedTemplateIndex,
    selectedTemplate,
    isLocationSelected,
    handleVenue,
    handleOnlineEvent,
    showCropDialog,
    banner_images,
    dropHandlerBanner,
    manualUploadBanner,
    deleteImageBanner,
    selectImageBanner,
    selectedImageBanner,
    event_images,
    dropHandlerEvent,
    manualUploadEvent,
    deleteImageEvent,
    selectImageEvent,
    selectedImageEvent,
    sponsorLevels,
    addSponsorLevel,
    deleteAllSponsorLevels,
    deleteSponsorLevel,
    uploadedImagesLogo,
    manualUploadLogo,
    deleteSponsorLogo,
    agendaTabs,
    activeAgendaTabIndex,
    addAgendaTabview,
    handleAgendaTabChange,
    addAgendaForm,
    agendaForms,
    deleteAllAgenda,
    deleteAgendaForm,
    faqs,
    addFAQ,
    deleteFAQ,
    deleteAllFAQ,
    removeAgendaTab,
    isEditing,
    editedAgenda,
    startEditing,
    stopEditing,
    performers,
    addPerformer,
    imageUrl,
    openFileInput,
    handleFileChange,
    deletePerformer,
    showDescription,
    showDescriptionForm,
    event_tickets,
    ticket_visibilities,
    isTicketSelected,
    handleFreeTicket,
    handlePaidTicket,
    eventUrl,
    previewEventUrl,
    visibilities,
    publishOption,
    showNewTicketForm,
    showTicketForm,
    showTicketList,
    backTicketList,
    templates,
    columns,
    selectedTags,
    tags,
    types,
    organizers,
    categories,
    publishStartDate,
    publishStartTime,
    handleChildFormSubmission,
    isEditMode,
    eventId,
    newTicketData,
    ticketCancel,
    startEditMode,
    draftSave,
    deleteTicket,
    filteredTickets,
  }
}
