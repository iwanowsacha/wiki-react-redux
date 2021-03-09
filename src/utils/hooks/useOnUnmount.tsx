import { ipcRenderer } from 'electron';

export default function useOnUnmount() {

  async function shouldUnmount() {
      const unmount: boolean = await ipcRenderer.invoke('on-component-unmount');
      return unmount;
  }

  return shouldUnmount;
}
