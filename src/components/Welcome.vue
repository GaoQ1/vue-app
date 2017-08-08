<template>
  <div class="welcome">
    <div class="welcome__title">
      <div class="welcome__title--main">欢迎使用恒大在线审图系统</div>
      <div class="welcome__title--small">Welcome to use Hengda online examination system</div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  @import "../styles/_mixin";
  .welcome {
    position: relative;
    background-color: $bg_light_color;
    width: 100%;
    height: 100%;
    @include e('title'){
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      @include m('main'){
        font-size: 26px;
        color: $font_color;
        letter-spacing: 2px;
      };
      @include m('small'){
        font-size: 14px;
        line-height: 1.4rem;
        color: $font_color
      };
    };
  }
</style>
