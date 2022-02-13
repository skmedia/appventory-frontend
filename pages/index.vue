<template>
  <div>
    <v-card>
      <PageHeader title="Recent applications">
        <v-btn
          class="ml-auto secondary darken-1"
          elevation="2"
          :to="'applications'"
        >
          Show all
        </v-btn>
      </PageHeader>

      <v-card-subtitle> ... </v-card-subtitle>
    </v-card>

    <v-card class="mt-4">
      <PageHeader title="Applications you are involved in">
        <v-btn
          class="ml-auto secondary darken-1"
          elevation="2"
          :to="'applications'"
        >
          Show all
        </v-btn>
      </PageHeader>

      <v-card-subtitle> ... </v-card-subtitle>
    </v-card>
  </div>
</template>
