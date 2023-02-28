<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h2>Переведжений текст</h2>
      </div>
    </div>
    <div class="row">

      <!-- Форма для додавання та виведення даних -->

      <div class="col-12">
        <!-- Додавання данних -->
        <form class="mb-3">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">Українська</label>
              <input v-model="ukr" type="text" class="form-control" />
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Польська</label>
              <input v-model="pol" type="text" class="form-control" />
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Англійська</label>
              <input v-model="eng" type="text" class="form-control" />
            </div>
            <!-- Список тегів -->
            <div class="col-md-2 mb-3">
              <label class="form-label">Тег</label>
              <select v-model="tag" class="form-select">
                <option value="" disabled>Виберіть тег</option>
                <option v-for="tag in tags" :value="tag">{{ tag }}</option>
                <option value="тег№1">тег№1</option>
                <option value="тег№2">тег№2</option>
                <option value="тег№3">тег№3</option>
              </select>
            </div>
            <!-- Кнопка яка змінюється в залежності від додавання нового чи редагованого тексту -->
            <div class="col-md-2 mb-3">
              <button v-if="!updateState" @click="addText" type="button" class="btn btn-primary mt-4">
                Додати
              </button>
              <button v-if="updateState" @click="updateText2" type="button" class="btn btn-success mt-4">
                Додати редаговане
              </button>
            </div>
          </div>

        </form>


        <!-- Виведження таблиці данних -->
        <table class="table">
          <thead>
            <tr>
              <th>Українська</th>
              <th>Польська</th>
              <th>Англійська</th>
              <th>Тег</th>
              <th>Керування</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="Text in Texts" :key="Text.id">
              <td>{{ Text.ukr }}</td>
              <td>{{ Text.pol }}</td>
              <td>{{ Text.eng }}</td>
              <td>{{ Text.tag }}</td>
              <td>
                <!-- Кнопки керування данними -->
                <button :disabled="updateState" @click="updateText(Text)" class="btn btn-success mr-2">
                  Редагувати
                </button>
                <button :disabled="updateState" @click="deleteText(Text.id)" class="btn btn-danger">
                  Видалити
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { db } from "../firebase";
import { onMounted } from "vue";

export default {
  name: "TextLists",

  setup() {
    // існуючі параметри даних
    const Texts = ref([]);
    const ukr = ref("");
    const pol = ref(""); 
    const eng = ref("");
    const tag = ref("");
    const TextTemp = ref({});
    const updateState = ref(false);

    onMounted(() => {
      db.collection("Texts")
        .orderBy("date")
        .onSnapshot((querySnapshot) => {
          Texts.value = [];
          querySnapshot.forEach((doc) => {
            Texts.value.push({ id: doc.id, ...doc.data() });
          });
        });
    });

    // Створення нових данних

    function addText() {
      if (!ukr.value || !pol.value || !eng.value || !tag.value) {
        alert("Будь ласка, заповніть усі поля");
        return;
      }
      db.collection("Texts")
        .add({
          id: "",
          date: new Date().getTime(),
          ukr: ukr.value,
          pol: pol.value,
          eng: eng.value,
          tag: tag.value,
        })
        .then(function (docref) {
          console.log(docref.id);
          db.collection("Texts")
            .doc(docref.id)
            .update({ id: docref.id });
        });

      ukr.value = "";
      pol.value = "";
      eng.value = "";
      tag.value = "";
    }


    // ВИДАЛЕННЯ

    function deleteText(id) {
      db.collection("Texts")
        .doc(id)
        .delete();
    }

    // перенести данні щоб їх відредагувати

    function updateText(TextTmp) {
      updateState.value = true;
      TextTemp.value = TextTmp;
      ukr.value = TextTmp.ukr;
      pol.value = TextTmp.pol;
      eng.value = TextTmp.eng;
      tag.value = TextTmp.tag;
    }

    // перенести редаговані данні назад в таблицю

    function updateText2() {
      let a = ukr.value;
      let b = pol.value;
      let c = eng.value;
      let e = tag.value;

      // перевірка на заповненість полів
      if (!a || !b || !c || !e) {
        alert("Будь ласка, заповніть усі поля");
        return;
      }

      db.collection("Texts")
        .doc(TextTemp.value.id)
        .update({
          ukr: a,
          pol: b,
          eng: c,
          tag: e,
        });

      updateState.value = false;
      ukr.value = "";
      pol.value = "";
      eng.value = "";
      tag.value = "";

    }
    return {
      addText,
      deleteText,
      updateText,
      updateText2,
      updateState,
      ukr,
      pol, 
      eng,
      tag,
      TextTemp,
      Texts,
    };
  },
};
</script>


<style scoped></style>
