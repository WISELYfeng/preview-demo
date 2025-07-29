<template>
  <BaseLayout :app-store="appStore">
    <template #header>
      <BaseHeader :app-store="appStore"> </BaseHeader>
    </template>
    <div class="help-wrap">
      <div class="page-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto enim animi accusantium odio reiciendis tempore quos libero ipsam voluptas, facere dolor quas quia voluptates. Nihil
        reiciendis sapiente veritatis dolores perferendis. Mollitia expedita molestias corrupti illo ipsum pariatur soluta placeat maxime aperiam ex, harum ducimus voluptatem odit quas voluptatum? Id
        dolor eligendi sit labore corrupti dolorem, perspiciatis quis ex ut accusamus! Eius fuga facilis harum praesentium pariatur architecto ipsa voluptates saepe ducimus amet non necessitatibus
        neque, exercitationem aut voluptatum ipsam eos quasi distinctio quis rem. Placeat tenetur accusamus aperiam expedita delectus! Fugiat asperiores doloribus suscipit, sint commodi culpa nulla
        praesentium rerum recusandae omnis expedita, quod similique. Magnam voluptatibus placeat quisquam sunt animi recusandae, praesentium suscipit beatae ea accusantium magni possimus eveniet! Quod
        aspernatur cum aliquid molestias rem repellendus fuga. A quibusdam aliquid est consectetur itaque, tempore iusto iste nulla, voluptas architecto possimus! Consectetur facere asperiores ducimus
        debitis dicta pariatur sunt officia! Iste fugiat odit molestiae, exercitationem reiciendis ullam, repudiandae ratione dolore natus corrupti expedita libero doloribus accusantium error quae,
        eos facere assumenda quod ad animi. Consectetur mollitia est sit officia aliquam. Doloribus corporis eum laudantium doloremque neque accusantium blanditiis ut recusandae libero provident, iure
        tenetur adipisci, nesciunt reprehenderit, nostrum similique labore. Quod numquam quisquam accusantium qui inventore odio vitae est repudiandae! Cumque distinctio fugit quisquam. Dolore saepe
        debitis voluptates nesciunt ut sint nihil quos reprehenderit, ducimus, cum vel optio repellendus porro asperiores ipsum. Suscipit fugit mollitia officiis maxime, repellat vitae ad. Quidem odio
        expedita nihil voluptatum delectus facilis nemo amet, maxime nesciunt quibusdam sequi officiis quos corporis ratione odit tenetur officia iure recusandae velit quod non cum eaque quis sint.
        Quos? Officia rem esse placeat accusamus ab perferendis dicta quibusdam. Odit aliquid reiciendis, natus quo dicta iusto maiores veniam maxime alias possimus odio eius id saepe dolore incidunt
        nobis assumenda doloribus! Eum repudiandae numquam iusto debitis voluptatum veritatis facere perspiciatis sed illum dicta, odit modi possimus consectetur dolorum harum ipsum itaque veniam
        omnis voluptatibus fugit laboriosam vel. Soluta nisi doloribus accusamus? Voluptatem incidunt eaque modi itaque quis deserunt! Ducimus, modi? Quas qui magnam ab illo earum, quibusdam
        architecto ex, a adipisci eveniet expedita ipsam nisi at repudiandae illum eaque quisquam minima. Fugit esse cupiditate vel quam, necessitatibus itaque officiis dolores, earum, odit totam cum
        cumque architecto assumenda nostrum repudiandae mollitia aliquam! Dolorum, nisi nemo rerum et cumque ex reprehenderit. Nam, reiciendis! Aliquam ullam nostrum atque asperiores qui optio illo
        tempore at, repellat rerum voluptatum obcaecati quidem aspernatur ratione expedita exercitationem quasi earum. Cum perspiciatis reprehenderit in? Eaque cumque consequatur explicabo reiciendis.
        Suscipit, repellat officia. Soluta numquam, unde dolores temporibus ipsa perspiciatis impedit et ab, repellat illo odit voluptate mollitia possimus molestiae dolore? Harum, fugit illum id
        repudiandae porro veniam. A, amet.
      </div>
    </div>
  </BaseLayout>
</template>

<script setup name="Help">
import { onMounted } from 'vue';
import BaseLayout from '@/frame/BaseLayout.vue';
import { useApp } from '@demo/store/app.js';
import BaseHeader from '@/frame/BaseHeader.vue';

const appStore = useApp();

onMounted(() => {
  console.log('Page2 onMounted');
});
</script>

<style lang="less" scoped>
.page-2 {
  height: 100%;
  background-color: var(--bg_deep);
  overflow: scroll;
}
</style>
