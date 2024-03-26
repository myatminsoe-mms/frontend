import { reactive, ref, onBeforeUnmount, computed, watch, onMounted } from 'vue'
import { required ,url } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useStore } from '../store'
import { Errors } from '@/utils/serverValidation'
import { useRouter } from 'vue-router'
import { format } from 'date-fns';

export default function useNew() {
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
    visibility: 'PUBLIC',
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
    event_tickets: [
      {
        id: null,
        name: "",
        entry_date: "",
        price: null,
        ticket_type: "",
        quantity: null,
        sale_start_at: "",
        sale_end_at: "",
        description: "",
        early_price: null,
        early_start_at: "",
        early_end_at: "",
        ticket_visibility: "",
        is_deleted: false
      },
    ],
  });

  const store = useStore()
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
      field: 'quantity',
      header: 'Quantity',
      sortable: true,
      selected: true,
      style: 'min-width: 12rem'
    },
    {
      field: 'status',
      header: 'Status',
      sortable: false,
      selected: true,
      style: 'min-width: 12rem'
    },
    {
      field: 'action',
      header: 'Action',
      sortable: false,
      selected: true,
      style: 'min-width: 15rem; max-width: 15rem',
      frozen: true,
      alignFrozen: 'right'
    }
  ])



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

  const uploadedImagesEvent = ref([])
  const selectedImageEvent = ref(null)

  const dropHandlerBanner = (event) => {
    const files = event.dataTransfer.files

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()

        reader.onload = () => {
          const newImage = {
            id: Date.now(),
            url: reader.result
          }

          banner_images.value.push(newImage)

          // Set the first uploaded image as the default selected image
          if (banner_images.value.length > 0) {
            selectedImageBanner.value = banner_images.value[0]
          }
        }

        reader.readAsDataURL(file)
      } else {
        console.log('Invalid file format. Please upload JPEG or PNG images.')
      }
    }
  }

  const manualUploadBanner = (event) => {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()

        reader.onload = () => {
          const newImage = {
            id: Date.now(),
            url: reader.result
          }

          banner_images.value.push(newImage)

          // Set the first uploaded image as the default selected image
          if (banner_images.value.length > 0) {
            selectedImageBanner.value = banner_images.value[0]
          }
        }

        reader.readAsDataURL(file)
      } else {
        console.log('Invalid file format. Please upload JPEG or PNG images.')
      }
    }
  }

  const selectImageBanner = (image) => {
    selectedImageBanner.value = image
  }

  const deleteImageBanner = (imageId) => {
    if (selectedImageBanner.value && selectedImageBanner.value.id === imageId) {
      selectedImageBanner.value = null
    }
    const index = banner_images.value.findIndex((image) => image.id === imageId)
    if (index !== -1) {
      banner_images.value.splice(index, 1)
      if (selectedImageBanner.value == null) {
        selectedImageBanner.value = banner_images.value[0]
      }
    }
  }

  const dropHandlerEvent = (event) => {
    const files = event.dataTransfer.files

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()

        reader.onload = () => {
          const newImage = {
            id: Date.now(),
            url: reader.result
          }

          uploadedImagesEvent.value.push(newImage)

          // Set the first uploaded image as the default selected image
          if (uploadedImagesEvent.value.length > 0) {
            selectedImageEvent.value = uploadedImagesEvent.value[0]
          }
        }

        reader.readAsDataURL(file)
      } else {
        console.log('Invalid file format. Please upload JPEG or PNG images.')
      }
    }
  }

  const manualUploadEvent = (event) => {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()

        reader.onload = () => {
          const newImage = {
            id: Date.now(),
            url: reader.result
          }

          uploadedImagesEvent.value.push(newImage)

          // Set the first uploaded image as the default selected image
          if (uploadedImagesEvent.value.length > 0) {
            selectedImageEvent.value = uploadedImagesEvent.value[0]
          }
        }

        reader.readAsDataURL(file)
      } else {
        console.log('Invalid file format. Please upload JPEG or PNG images.')
      }
    }
  }

  const selectImageEvent = (image) => {
    selectedImageEvent.value = image
  }

  const deleteImageEvent = (imageId) => {
    if (selectedImageEvent.value && selectedImageEvent.value.id === imageId) {
      selectedImageEvent.value = null
    }
    const index = uploadedImagesEvent.value.findIndex((image) => image.id === imageId)
    if (index !== -1) {
      uploadedImagesEvent.value.splice(index, 1)
      if (selectedImageEvent.value == null) {
        selectedImageEvent.value = uploadedImagesEvent.value[0]
      }
    }
  }

  const sponsorLevels = ref([])

  // Add Sponsor Level
  const addSponsorLevel = () => {
    const newSponsorLevel = {
      id: Date.now(),
      title: '',
      logoImages: []
    }
    sponsorLevels.value.push(newSponsorLevel)
  }

  const deleteSponsorLevel = (index) => {
    sponsorLevels.value.splice(index, 1)
  }

  const deleteAllSponsorLevels = () => {
    sponsorLevels.value = []
  }

  const deleteAllAgenda = () => {
    agendaTabs.value = []
  }

  const uploadedImagesLogo = ref([])
  const deleteSponsorLogo = (levelIndex, imageId) => {
    const level = sponsorLevels.value[levelIndex]
    const imageIndex = level.logoImages.findIndex((image) => image.id === imageId)

    if (imageIndex !== -1) {
      level.logoImages.splice(imageIndex, 1)
    }
  }

  // Function to manually upload logo images for a sponsor level
  const manualUploadLogo = (levelIndex, event) => {
    const files = event.target.files
    const sponsorLevel = sponsorLevels.value[levelIndex]

    if (sponsorLevel && sponsorLevel.logoImages) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Read the file and create newLogoImage
        const newLogoImage = {
          id: Date.now(),
          url: URL.createObjectURL(file)
        }
        sponsorLevel.logoImages.push(newLogoImage)
      }
    }
  }

  const agendaTabs = ref([])
  const activeAgendaTabIndex = ref(0)

  const addAgendaTabview = () => {
    agendaTabs.value.push({})
    activeAgendaTabIndex.value = agendaTabs.value.length - 1
  }

  const handleAgendaTabChange = (event) => {
    activeAgendaTabIndex.value = event.index
  }

  const agendaForms = ref([
    {
      title: '',
      startTime: new Date(),
      endTime: new Date(),
      description: '',
      performers: [],
    },
  ]);

  const addAgendaForm = (index) => {
    const newAgendaForm = {
      title: '',
      startTime: new Date(),
      endTime: new Date(),
      description: '',
      performers: [],
    };

    agendaForms.value.splice(index + 1, 0, newAgendaForm);
    // agendaForms.value.push(newAgendaForm);
  };



  const removeAgendaTab = (index) => {
    agendaTabs.value.splice(index, 1);
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
      // const performer = performers.value[index];
      const input = document.getElementById(`avatarInput_${index}`);
      if (input) {
        input.click();
      }
    };

    const handleFileChange = (performerIndex, event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          performers.value[performerIndex].imageUrl = reader.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const deletePerformer = (index) => {
      performers.value.splice(index, 1);
    };

  const addPerformer = () => {
    const newPerformer = { 
      name: '', 
      image: null 
    };
    performers.value.push(newPerformer);
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
    faqs.value.push(newFAQ)
  }

  const deleteFAQ = (index) => {
    faqs.value.splice(index, 1)
  }

  const deleteAllFAQ = () => {
    faqs.value = [];
  };

  const addNewTab = () => {
    addAgendaTabview();
  };

  const checked = ref(false);
  const ticketVisibility = ref('show');

  const isFreeTicketSelected = ref(false);
  
  const  handleFreeTicket = () => {
    isFreeTicketSelected.value = true;
  }

  const  handlePaidTicket = () => {
    isFreeTicketSelected.value = false;
  }

  const eventUrl = ref('');
  const previewEventUrl = ref('');
  const visibility = ref('public');
  const publishOption = ref('now');

  const showTicketForm = ref(false);

  const showNewTicketForm = () => {
    showTicketForm.value = true;
  };

  const hideNewTicketForm = () => {
    showTicketForm.value = false;
  };

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
        tags.value.push({ id: options[i].id, name: options[i].name })
      }
    }
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

  // onBeforeUpdate(() => {
  //   // Format start_time
  //   if (v$.start_time.$model) {
  //     v$.start_time.$model = moment(v$.start_time.$model).format('HH:mm:ss');
  //   }

  //   // Format end_time
  //   if (v$.end_time.$model) {
  //     v$.end_time.$model = moment(v$.end_time.$model).format('HH:mm:ss');
  //   }
  // });

  onMounted(() => {
    fetchTags();
    fetchType();
    fetchCategory();
    fetchOrganizer();
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const tickets = ref([]);

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

  watch(
    () => state,
    () => {
      errors.clear()
    },
    { deep: true }
  )

  const submitted = ref(false);

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

    submitted.value = true

    if (!isFormValid) {
      return
    }

    if (!isLoading.value) {
      addEvent()
    }
  }


  const addEvent = async () => {
    errors.clear()
    isLoading.value = true

    try {
      await store.add({
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
        start_time: format(state.start_time, 'HH:mm:ss'),
        end_time: format(state.end_time, 'HH:mm:ss'),
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
      })

      const response = store.getAddResponse

      if (response) {
        const eventId = response.data.id;
        router.push({ name: 'editEvent', params: { id: eventId } });
      }

      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      if (error.status === 422) {
        const err = error.data.errors
        console.log(err)
        errors.record(err)
      }
    }
  }

  return {
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
    faqs,
    addFAQ,
    deleteFAQ,
    deleteAllFAQ,
    removeAgendaTab,
    addNewTab,
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
    tickets,
    ticketVisibility,
    isFreeTicketSelected,
    handleFreeTicket,
    handlePaidTicket,
    eventUrl,
    previewEventUrl,
    visibility,
    publishOption,
    showNewTicketForm,
    hideNewTicketForm,
    showTicketForm,
    templates,
    columns,
    checked,
    selectedTags,
    tags,
    types,
    organizers,
    categories,
  }
}
