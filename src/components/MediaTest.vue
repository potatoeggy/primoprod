<template>
  <div id="players">
    <p>close_win</p>
    <audio controls>
      <source src="../assets/audio/close_win.mp3" type="audio/mpeg" />
    </audio>
    <p>open_win</p>
    <audio controls>
      <source src="../assets/audio/open_win.mp3" type="audio/mpeg" />
    </audio>
    <p>switch_task</p>
    <audio controls>
      <source src="../assets/audio/switch_task.mp3" type="audio/mpeg" />
    </audio>
    <p>switch_type</p>
    <audio controls>
      <source src="../assets/audio/switch_type.mp3" type="audio/mpeg" />
    </audio>
    <p>3 single</p>
    <video controls>
      <source src="../assets/video/3starwish-single.mp4" />
    </video>
    <p>4 single</p>
    <video controls>
      <source src="../assets/video/4starwish-single.mp4" />
    </video>
    <p>4</p>
    <video controls>
      <source src="../assets/video/4starwish.mp4" />
    </video>
    <p>5 single</p>
    <video controls>
      <source src="../assets/video/5starwish-single.mp4" />
    </video>
    <p>5</p>
    <video controls>
      <source src="../assets/video/5starwish.mp4" />
    </video>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class MediaTest extends Vue {
  msg!: string;
}
</script>

<style scoped>
video {
  width: 500px;
}
</style>
